---
title: OpenTelemetry 지원
description: 빌드의 텔레메트리 데이터를 분석합니다
keywords:
  - 빌드
  - buildx buildkit
  - opentele메트리
aliases:
  - /build/building/opentelemetry/
---

Buildx와 BuildKit은 [OpenTelemetry](https://opentelemetry.io/)를 지원합니다.

[Jaeger](https://github.com/jaegertracing/jaeger)에 추적을 데이터를 전송하려면, `driver-opt`를 사용하여 `JAEGER_TRACE` 환경 변수를 수집 주소로 설정합니다.

먼저 Jaeger 컨테이너를 생성합니다:

```bash
$ docker run -d --name jaeger -p "6831:6831/udp" -p "16686:16686" --restart unless-stopped jaegertracing/all-in-one
```

그런 다음 `JAEGER_TRACE` 환경 변수를 통해 Jaeger 인스턴스를 사용할
`docker-container` 빌더를 [생성합니다](/manuals/build/builders/drivers/docker-container.md):

```bash
$ docker buildx create --use \
  --name mybuilder \
  --driver docker-container \
  --driver-opt "network=host" \
  --driver-opt "env.JAEGER_TRACE=localhost:6831"
```

`mybuilder`를 부트스트랩하고 [검사합니다](/reference/cli/docker/buildx/inspect.md):

```bash
$ docker buildx inspect --bootstrap
```

Buildx 명령은 `http://127.0.0.1:16686/`에서 추적되어야 합니다:

![OpenTelemetry Buildx Bake](../images/opentelemetry.png)
