---
title: Docker CLI를 위한 OpenTelemetry
description: Docker 명령줄에 대한 OpenTelemetry 메트릭을 수집하는 방법을 알아보세요
keywords:
  - otel
  - opentelemetry
  - 텔레메트리
  - 추적
  - 트레이싱
  - 메트릭
  - 로그
aliases:
  - /config/otel/
---

Docker CLI는 명령 호출에 대한 메트릭을 내보내기 위해 [OpenTelemetry](https://opentelemetry.io/docs/) 계측을 지원합니다.
기본적으로는 비활성화되어 있습니다. CLI를 구성하여 지정한 엔드포인트로 메트릭을 내보내도록 설정할 수 있습니다.
이를 통해 `docker` 명령 호출에 대한 정보를 수집하여 Docker 사용에 대한 더 많은 통찰력을 얻을 수 있습니다.

메트릭 내보내기는 옵트인 방식이며, 메트릭 수집기의 대상 주소를 지정하여 데이터가 전송되는 위치를 제어할 수 있습니다.

## OpenTelemetry란 무엇인가요? {#what-is-opentelemetry}

OpenTelemetry, 줄여서 OTel은 추적, 메트릭 및 로그와 같은 텔레메트리 데이터를 생성하고 관리하기 위한 개방형 관측 프레임워크입니다.
OpenTelemetry는 벤더 및 도구에 구애받지 않으므로 다양한 관측 백엔드와 함께 사용할 수 있습니다.

Docker CLI에서 OpenTelemetry 계측을 지원한다는 것은 CLI가 OpenTelemetry 사양에서 정의한 프로토콜과 규칙을 사용하여 발생하는 이벤트에 대한 정보를 내보낼 수 있음을 의미합니다.

## 작동 방식 {#how-it-works}

Docker CLI는 기본적으로 텔레메트리 데이터를 내보내지 않습니다. 시스템에 환경 변수를 설정한 경우에만 Docker CLI가 지정한 엔드포인트로 OpenTelemetry 메트릭을 내보내려고 시도합니다.

```bash
DOCKER_CLI_OTEL_EXPORTER_OTLP_ENDPOINT=<endpoint>
```

이 변수는 `docker` CLI 호출에 대한 텔레메트리 데이터를 전송할 OpenTelemetry 수집기의 엔드포인트를 지정합니다. 데이터를 수집하려면 해당 엔드포인트에서 수신 대기하는 OpenTelemetry 수집기가 필요합니다.

수집기의 목적은 텔레메트리 데이터를 수신하고 처리하여 백엔드로 내보내는 것입니다. 백엔드는 텔레메트리 데이터가 저장되는 곳입니다.
Prometheus나 InfluxDB와 같은 여러 백엔드 중에서 선택할 수 있습니다.

일부 백엔드는 메트릭을 직접 시각화하는 도구를 제공합니다.
또는 Grafana와 같이 더 유용한 그래프를 생성할 수 있는 전용 프런트엔드를 실행할 수도 있습니다.

## 설정 {#setup}

Docker CLI에 대한 텔레메트리 데이터를 수집하려면 다음을 수행해야 합니다:

- OpenTelemetry 수집기 엔드포인트를 가리키도록 `DOCKER_CLI_OTEL_EXPORTER_OTLP_ENDPOINT` 환경 변수를 설정합니다.
- CLI 명령 호출에서 신호를 수신하는 OpenTelemetry 수집기를 실행합니다.
- 수집기에서 수신한 데이터를 저장할 백엔드를 실행합니다.

다음 Docker Compose 파일은 OpenTelemetry를 시작하기 위한 일련의 서비스를 부트스트랩합니다.
CLI가 메트릭을 보낼 수 있는 OpenTelemetry 수집기와 수집기에서 메트릭을 긁어오는 Prometheus 백엔드를 포함합니다.

```yaml {collapse=true,title=compose.yml}
name: cli-otel
services:
  prometheus:
    image: prom/prometheus
    command:
      - "--config.file=/etc/prometheus/prom.yml"
    ports:
      # Prometheus 프런트엔드를 localhost:9091에 게시합니다
      - 9091:9090
    restart: always
    volumes:
      # Prometheus 데이터를 볼륨에 저장합니다:
      - prom_data:/prometheus
      # prom.yml 구성 파일을 마운트합니다
      - ./prom.yml:/etc/prometheus/prom.yml
  otelcol:
    image: otel/opentelemetry-collector
    restart: always
    depends_on:
      - prometheus
    ports:
      - 4317:4317
    volumes:
      # otelcol.yml 구성 파일을 마운트합니다
      - ./otelcol.yml:/etc/otelcol/config.yaml

volumes:
  prom_data:
```

이 서비스는 `compose.yml`과 함께 다음 두 개의 구성 파일이 존재한다고 가정합니다:

- ```yaml {collapse=true,title=otelcol.yml}
  # gRPC 및 HTTP를 통해 신호를 수신합니다
  receivers:
    otlp:
      protocols:
        grpc:
        http:

  # Prometheus가 긁어올 엔드포인트를 설정합니다
  exporters:
    prometheus:
      endpoint: "0.0.0.0:8889"

  service:
    pipelines:
      metrics:
        receivers: [otlp]
        exporters: [prometheus]
  ```

- ```yaml {collapse=true,title=prom.yml}
  # Prometheus가 OpenTelemetry 수집기 엔드포인트를 긁어오도록 구성합니다
  scrape_configs:
    - job_name: "otel-collector"
      scrape_interval: 1s
      static_configs:
        - targets: ["otelcol:8889"]
  ```

이 파일들이 준비되면:

1. Docker Compose 서비스를 시작합니다:

   ```bash
   $ docker compose up
   ```

2. Docker CLI가 OpenTelemetry 수집기로 텔레메트리를 내보내도록 구성합니다.

   ```bash
   $ export DOCKER_CLI_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
   ```

3. `docker` 명령을 실행하여 CLI가 OpenTelemetry 수집기로 메트릭 신호를 보내도록 합니다.

   ```bash
   $ docker version
   ```

4. CLI에서 생성된 텔레메트리 메트릭을 보려면 http://localhost:9091/graph로 이동하여 Prometheus 표현식 브라우저를 엽니다.

5. **Query** 필드에 `command_time_milliseconds_total`을 입력하고 쿼리를 실행하여 텔레메트리 데이터를 확인합니다.

## 사용 가능한 메트릭 {#available-metrics}

Docker CLI는 현재 명령 실행 시간을 밀리초 단위로 측정하는 단일 메트릭 `command.time`을 내보냅니다. 이 메트릭에는 다음과 같은 속성이 있습니다:

- `command.name`: 명령의 이름
- `command.status.code`: 명령의 종료 코드
- `command.stderr.isatty`: stderr가 TTY에 연결된 경우 true
- `command.stdin.isatty`: stdin이 TTY에 연결된 경우 true
- `command.stdout.isatty`: stdout이 TTY에 연결된 경우 true
