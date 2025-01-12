---
title: 컨테이너 기본값 재정의
weight: 2
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지에서는 `docker run` 명령을 사용하여 컨테이너 기본값을 재정의하는 방법을 배웁니다.
aliases:
  - /guides/docker-concepts/running-containers/overriding-container-defaults/
---

<YoutubeEmbed videoId="PFszWK3BB8I" />

## 설명 {#explanation}

도커 컨테이너가 시작되면 애플리케이션이나 명령을 실행합니다. 컨테이너는 이미지의 구성에서 이 실행 파일(스크립트 또는 파일)을 가져옵니다. 컨테이너는 일반적으로 잘 작동하는 기본 설정을 가지고 있지만 필요에 따라 변경할 수 있습니다. 이러한 조정은 컨테이너의 프로그램이 원하는 방식으로 실행되도록 도와줍니다.

예를 들어, 기존 데이터베이스 컨테이너가 표준 포트를 수신 대기하고 있고 동일한 데이터베이스 컨테이너의 새 인스턴스를 실행하려는 경우 새 컨테이너가 수신 대기하는 포트 설정을 변경하여 기존 컨테이너와 충돌하지 않도록 할 수 있습니다. 때로는 프로그램이 무거운 작업을 처리하기 위해 더 많은 리소스를 필요로 하는 경우 컨테이너에 사용할 수 있는 메모리를 늘리거나 프로그램이 제대로 작동하는 데 필요한 특정 구성 세부 정보를 제공하기 위해 환경 변수를 설정할 수 있습니다.

`docker run` 명령은 이러한 기본값을 재정의하고 컨테이너의 동작을 원하는 대로 조정할 수 있는 강력한 방법을 제공합니다. 이 명령은 컨테이너 동작을 즉시 사용자 정의할 수 있는 여러 플래그를 제공합니다.

다음은 이를 달성할 수 있는 몇 가지 방법입니다.

### 네트워크 포트 재정의 {#overriding-the-network-ports}

때로는 개발 및 테스트 목적으로 별도의 데이터베이스 인스턴스를 사용하고 싶을 수 있습니다. 동일한 포트에서 이러한 데이터베이스 인스턴스를 실행하면 충돌할 수 있습니다. `docker run`의 `-p` 옵션을 사용하여 컨테이너 포트를 호스트 포트에 매핑하여 여러 인스턴스를 충돌 없이 실행할 수 있습니다.

```bash
$ docker run -d -p HOST_PORT:CONTAINER_PORT postgres
```

### 환경 변수 설정 {#setting-environment-variables}

이 옵션은 컨테이너 내부에 값이 `bar`인 환경 변수 `foo`를 설정합니다.

```bash
$ docker run -e foo=bar postgres env
```

다음과 같은 출력이 표시됩니다:

```bash
HOSTNAME=2042f2e6ebe4
foo=bar
```

:::tip
`.env` 파일은 여러 `-e` 플래그를 여러개 넣지 않고도 도커 컨테이너에 환경 변수를 설정하는 편리한 방법입니다. `.env` 파일을 사용하려면 `docker run` 명령에 `--env-file` 옵션을 전달할 수 있습니다.

```bash
$ docker run --env-file .env postgres env
```

:::

### 컨테이너의 리소스 소비 제한 {#restricting-the-container-to-consume-the-resources}

`docker run` 명령의 `--memory` 및 `--cpus` 플래그를 사용하여 컨테이너가 사용할 수 있는 CPU 및 메모리 양을 제한할 수 있습니다. 예를 들어, Python API 컨테이너의 메모리 제한을 설정하여 호스트의 과도한 리소스 소비를 방지할 수 있습니다. 다음은 명령입니다:

```bash
$ docker run -e POSTGRES_PASSWORD=secret --memory="512m" --cpus="0.5" postgres
```

이 명령은 컨테이너의 메모리 사용량을 512MB로 제한하고 CPU 할당량을 0.5로 정의하여 반 코어를 사용합니다.

> **실시간 리소스 사용량 모니터링**
>
> `docker stats` 명령을 사용하여 실행 중인 컨테이너의 실시간 리소스 사용량을 모니터링할 수 있습니다. 이를 통해 할당된 리소스가 충분한지 또는 조정이 필요한지 이해할 수 있습니다.

이러한 `docker run` 플래그를 효과적으로 사용하여 컨테이너화된 애플리케이션의 동작을 특정 요구 사항에 맞게 조정할 수 있습니다.

## 직접 해보기 {#try-it-out}

이 실습 가이드에서는 `docker run` 명령을 사용하여 컨테이너 기본값을 재정의하는 방법을 배웁니다.

1. [도커 데스크탑 다운로드 및 설치](/get-started/get-docker/).

### Postgres 데이터베이스의 여러 인스턴스 실행 {#run-multiple-instance-of-the-postgres-database}

1. 다음 명령을 사용하여 [Postgres 이미지](https://hub.docker.com/_/postgres)를 사용하여 컨테이너를 시작합니다:

   ```bash
   $ docker run -d -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres
   ```

   이 명령은 백그라운드에서 Postgres 데이터베이스를 시작하며, 표준 컨테이너 포트 `5432`에서 수신 대기하고 호스트 머신의 포트 `5432`에 매핑됩니다.

2. 다른 포트에 매핑된 두 번째 Postgres 컨테이너를 시작합니다.

   ```bash
   $ docker run -d -e POSTGRES_PASSWORD=secret -p 5433:5432 postgres
   ```

   이 명령은 백그라운드에서 또 다른 Postgres 컨테이너를 시작하며, 컨테이너의 표준 Postgres 포트 `5432`에서 수신 대기하지만 호스트 머신의 포트 `5433`에 매핑됩니다. 이 새로운 컨테이너가 기존 실행 중인 컨테이너와 충돌하지 않도록 호스트 포트를 재정의합니다.

3. Docker Desktop 대시보드의 **Containers** 보기로 이동하여 두 컨테이너가 실행 중인지 확인합니다.

   ![Docker Desktop 대시보드에서 실행 중인 Postgres 컨테이너 인스턴스를 보여주는 스크린샷](images/running-postgres-containers.webp?border=true)

### 제어된 네트워크에서 Postgres 컨테이너 실행 {#run-postgres-container-in-a-controlled-network}

기본적으로 컨테이너는 실행 시 자동으로 브리지 네트워크라는 특수 네트워크에 연결됩니다. 이 브리지 네트워크는 가상 브리지처럼 작동하여 동일한 호스트의 컨테이너가 서로 통신할 수 있도록 하면서 외부 세계 및 다른 호스트와 격리됩니다. 대부분의 컨테이너 상호 작용에 편리한 시작점입니다. 그러나 특정 시나리오에서는 네트워크 구성을 더 많이 제어하고 싶을 수 있습니다.

여기서 사용자 정의 네트워크가 등장합니다. `docker run` 명령에 `--network` 플래그를 전달하여 사용자 정의 네트워크를 생성할 수 있습니다. `--network` 플래그가 없는 모든 컨테이너는 기본 브리지 네트워크에 연결됩니다.

Postgres 컨테이너를 사용자 정의 네트워크에 연결하는 방법을 보려면 다음 단계를 따르십시오.

1. 다음 명령을 사용하여 새 사용자 정의 네트워크를 생성합니다:

   ```bash
   $ docker network create mynetwork
   ```

2. 다음 명령을 실행하여 네트워크를 확인합니다:

   ```bash
   $ docker network ls
   ```

   이 명령은 새로 생성된 "mynetwork"를 포함한 모든 네트워크를 나열합니다.

3. 다음 명령을 사용하여 Postgres를 사용자 정의 네트워크에 연결합니다:

   ```bash
   $ docker run -d -e POSTGRES_PASSWORD=secret -p 5434:5432 --network mynetwork postgres
   ```

   이 명령은 백그라운드에서 Postgres 컨테이너를 시작하며, 호스트 포트 5434에 매핑되고 `mynetwork` 네트워크에 연결됩니다. 컨테이너를 사용자 정의 도커 네트워크에 연결하여 더 나은 격리 및 다른 컨테이너와의 통신을 위해 컨테이너 기본값을 재정의하기 위해 `--network` 매개변수를 전달했습니다. `docker network inspect` 명령을 사용하여 컨테이너가 이 새로운 브리지 네트워크에 연결되었는지 확인할 수 있습니다.

   > **기본 브리지와 사용자 정의 네트워크의 주요 차이점**
   >
   > 1. DNS 매핑: 기본적으로 기본 브리지 네트워크에 연결된 컨테이너는 IP 주소로만 서로 통신할 수 있습니다. (`--link` 옵션을 사용하지 않는 한 이는 레거시로 간주됩니다). 다양한 [기술적 단점](/engine/network/drivers/bridge/#differences-between-user-defined-bridges-and-the-default-bridge)으로 인해 프로덕션 사용에는 권장되지 않습니다. 사용자 정의 네트워크에서는 컨테이너가 이름 또는 별칭으로 서로를 해결할 수 있습니다.
   > 2. 격리: `--network`가 지정되지 않은 모든 컨테이너는 기본 브리지 네트워크에 연결되므로 관련 없는 컨테이너가 통신할 수 있어 위험할 수 있습니다. 사용자 정의 네트워크를 사용하면 해당 네트워크에 연결된 컨테이너만 통신할 수 있는 범위가 지정된 네트워크를 제공하여 더 나은 격리를 제공합니다.

### 리소스 관리 {#manage-the-resources}

기본적으로 컨테이너는 리소스 사용량에 제한이 없습니다. 그러나 공유 시스템에서는 리소스를 효과적으로 관리하는 것이 중요합니다. 실행 중인 컨테이너가 호스트 머신의 메모리를 너무 많이 소비하지 않도록 하는 것이 중요합니다.

여기서 `docker run` 명령이 다시 빛을 발합니다. 이 명령은 컨테이너가 사용할 수 있는 CPU 및 메모리 양을 제한하는 `--memory` 및 `--cpus`와 같은 플래그를 제공합니다.

```bash
$ docker run -d -e POSTGRES_PASSWORD=secret --memory="512m" --cpus=".5" postgres
```

`--cpus` 플래그는 컨테이너의 CPU 할당량을 지정합니다. 여기서는 반 CPU 코어(0.5)로 설정되어 있으며 `--memory` 플래그는 컨테이너의 메모리 제한을 지정합니다. 이 경우 512MB로 설정되어 있습니다.

### Docker Compose에서 기본 CMD 및 ENTRYPOINT 재정의 {#override-the-default-cmd-and-entrypoint-in-docker-compose}

때로는 Docker 이미지에 정의된 기본 명령(`CMD`) 또는 엔트리 포인트(`ENTRYPOINT`)를 재정의해야 할 수도 있습니다. 특히 Docker Compose를 사용할 때 그렇습니다.

1. 다음 내용을 포함하는 `compose.yml` 파일을 생성합니다:

   ```yaml
   services:
     postgres:
       image: postgres
       entrypoint: ["docker-entrypoint.sh", "postgres"]
       command: ["-h", "localhost", "-p", "5432"]
       environment:
         POSTGRES_PASSWORD: secret
   ```

   Compose 파일은 공식 Postgres 이미지를 사용하고 엔트리 포인트 스크립트를 설정하며 암호 인증으로 컨테이너를 시작하는 `postgres`라는 서비스를 정의합니다.

2. 다음 명령을 실행하여 서비스를 시작합니다:

   ```bash
   $ docker compose up -d
   ```

   이 명령은 Docker Compose 파일에 정의된 Postgres 서비스를 시작합니다.

3. Docker Desktop 대시보드를 사용하여 인증을 확인합니다.

   Docker Desktop 대시보드를 열고 **Postgres** 컨테이너를 선택한 다음 **Exec**을 선택하여 컨테이너 셸에 들어갑니다. 다음 명령을 입력하여 Postgres 데이터베이스에 연결할 수 있습니다:

   ```bash
   # psql -U postgres
   ```

   ![Docker Desktop 대시보드에서 Postgres 컨테이너를 선택하고 EXEC 버튼을 사용하여 셸에 들어가는 스크린샷](images/exec-into-postgres-container.webp?border=true)

   :::note
   PostgreSQL 이미지는 로컬에서 신뢰 인증을 설정하므로 로컬호스트(동일한 컨테이너 내부)에서 연결할 때 암호가 필요하지 않을 수 있습니다. 그러나 다른 호스트/컨테이너에서 연결할 때는 암호가 필요합니다.
   :::

### `docker run`으로 기본 CMD 및 ENTRYPOINT 재정의 {#override-the-default-cmd-and-entrypoint-with-docker-run}

다음 명령을 사용하여 `docker run` 명령을 직접 사용하여 기본값을 재정의할 수도 있습니다:

```bash
$ docker run -e POSTGRES_PASSWORD=secret postgres docker-entrypoint.sh -h localhost -p 5432
```

이 명령은 Postgres 컨테이너를 실행하고 암호 인증을 위한 환경 변수를 설정하며 기본 시작 명령을 재정의하고 호스트 이름 및 포트 매핑을 구성합니다.

## 추가 자료 {#additional-resources}

- [Compose로 환경 변수 설정 방법](/compose/how-tos/environment-variables/set-environment-variables/)
- [컨테이너란 무엇인가](/get-started/docker-concepts/the-basics/what-is-a-container/)

## 다음 단계 {#next-steps}

이제 컨테이너 기본값을 재정의하는 방법을 배웠으므로 컨테이너 데이터를 유지하는 방법을 배울 차례입니다.

<Button href="persisting-container-data">컨테이너 데이터 유지</Button>
