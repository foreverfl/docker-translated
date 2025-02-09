---
description: 프로덕션 환경에서 Docker Compose 사용 가이드
keywords:
  - 컴포즈
  - 오케스트레이션
  - 컨테이너
  - 프로덕션
title: 프로덕션 환경에서 Compose 사용하기
weight: 100
aliases:
  - /compose/production/
---

개발 환경에서 Compose로 앱을 정의하면 CI, 스테이징, 프로덕션과 같은 다양한 환경에서 애플리케이션을 실행하는 데 이 정의를 사용할 수 있습니다.

애플리케이션을 배포하는 가장 쉬운 방법은 개발 환경에서와 유사하게 단일 서버에서 실행하는 것입니다. 애플리케이션을 확장하려면 Swarm 클러스터에서 Compose 앱을 실행할 수 있습니다.

### 프로덕션을 위한 Compose 파일 수정 {#modify-your-compose-file-for-production}

앱 구성을 프로덕션에 맞게 준비하려면 변경이 필요할 수 있습니다. 이러한 변경 사항에는 다음이 포함될 수 있습니다:

- 애플리케이션 코드에 대한 볼륨 바인딩 제거, 코드가 컨테이너 내부에 유지되고 외부에서 변경할 수 없도록 하기
- 호스트의 다른 포트에 바인딩
- 로깅의 자세함을 줄이거나 이메일 서버와 같은 외부 서비스에 대한 설정을 지정하기 위해 환경 변수를 다르게 설정
- 다운타임을 방지하기 위해 [`restart: always`](/reference/compose-file/services.md#restart)와 같은 재시작 정책 지정
- 로그 수집기와 같은 추가 서비스 추가

이러한 이유로, 예를 들어 `production.yml`과 같은 추가 Compose 파일을 정의하여 프로덕션에 적합한 구성을 지정하는 것을 고려하십시오. 이 구성 파일에는 원래 Compose 파일에서 변경하려는 내용만 포함하면 됩니다. 추가 Compose 파일은 원래 `compose.yml` 위에 적용되어 새로운 구성을 만듭니다.

두 번째 구성 파일이 있으면 `-f` 옵션을 사용하여 사용할 수 있습니다:

```bash
$ docker compose -f compose.yml -f production.yml up -d
```

보다 완전한 예제와 다른 옵션에 대해서는 [여러 Compose 파일 사용](multiple-compose-files/_index.md)을 참조하십시오.

### 변경 사항 배포 {#deploying-changes}

앱 코드에 변경 사항을 적용할 때 이미지를 다시 빌드하고 앱의 컨테이너를 다시 생성해야 합니다. `web`이라는 서비스를 다시 배포하려면 다음을 사용하십시오:

```bash
$ docker compose build web
$ docker compose up --no-deps -d web
```

이 첫 번째 명령은 `web`의 이미지를 다시 빌드한 다음 `web` 서비스를 중지하고, 삭제하고, 다시 생성합니다. `--no-deps` 플래그는 Compose가 `web`이 의존하는 서비스를 다시 생성하지 않도록 합니다.

### 단일 서버에서 Compose 실행 {#running-compose-on-a-single-server}

`DOCKER_HOST`, `DOCKER_TLS_VERIFY`, `DOCKER_CERT_PATH` 환경 변수를 적절히 설정하여 원격 Docker 호스트에 앱을 배포할 수 있습니다. 자세한 내용은 [미리 정의된 환경 변수](environment-variables/envvars.md)를 참조하십시오.

환경 변수를 설정한 후에는 추가 구성 없이 모든 일반 `docker compose` 명령이 작동합니다.
