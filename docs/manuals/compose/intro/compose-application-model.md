---
title: Compose 작동 방식
weight: 10
description: 예시를 통해 Compose 작동 방식과 Compose 애플리케이션 모델 이해하기
keywords:
 - compose
 - docker compose
 - compose 명세
 - compose 모델
aliases:
  - /compose/compose-file/02-model/
  - /compose/compose-yaml-file/
  - /compose/compose-application-model/
---

Docker Compose를 사용하면 [Compose 파일](#the-compose-file)로 알려진 YAML 구성 파일을 사용하여 애플리케이션의 서비스를 구성하고, [Compose CLI](#cli)를 사용하여 구성에서 모든 서비스를 생성하고 시작할 수 있습니다.

Compose 파일 또는 `compose.yaml` 파일은 다중 컨테이너 애플리케이션을 정의하는 방법에 대한 [Compose 명세](/reference/compose-file/_index.md)의 규칙을 따릅니다. 이것은 공식 [Compose 명세](https://github.com/compose-spec/compose-spec)의 Docker Compose 구현입니다.

<details>
<summary>Compose 애플리케이션 모델</summary>

애플리케이션의 컴퓨팅 구성 요소는 [서비스](/reference/compose-file/services.md)로 정의됩니다. 서비스는 동일한 컨테이너 이미지와 구성을 한 번 이상 실행하여 플랫폼에서 구현되는 추상 개념입니다.

서비스는 [네트워크](/reference/compose-file/networks.md)를 통해 서로 통신합니다. Compose 명세에서 네트워크는 서비스에 연결된 컨테이너 간에 IP 경로를 설정하기 위한 플랫폼 기능 추상화입니다.

서비스는 [볼륨](/reference/compose-file/volumes.md)에 영구 데이터를 저장하고 공유합니다. 명세는 이러한 영구 데이터를 전역 옵션이 있는 고급 파일 시스템 마운트로 설명합니다.

일부 서비스는 런타임 또는 플랫폼에 따라 달라지는 구성 데이터가 필요합니다. 이를 위해 명세는 전용 [구성](/reference/compose-file/configs.md) 개념을 정의합니다. 서비스 컨테이너 관점에서 구성은 볼륨과 유사하여 컨테이너에 파일로 마운트됩니다. 그러나 실제 정의는 이 유형에 의해 추상화된 별개의 플랫폼 리소스 및 서비스를 포함합니다.

[비밀](/reference/compose-file/secrets.md)은 보안 고려 사항 없이 노출되어서는 안 되는 민감한 데이터를 위한 특정 구성 데이터입니다. 비밀은 파일로 컨테이너에 마운트되어 서비스에 제공되지만, 민감한 데이터를 제공하기 위한 플랫폼별 리소스는 Compose 명세 내에서 별개의 개념과 정의를 가질 만큼 충분히 구체적입니다.

:::note
볼륨, 구성 및 비밀을 사용하면 상위 수준에서 간단한 선언을 한 다음 서비스 수준에서 더 많은 플랫폼별 정보를 추가할 수 있습니다.
:::

프로젝트는 플랫폼에 애플리케이션 명세를 개별적으로 배포한 것입니다. 상위 수준 [`name`](/reference/compose-file/version-and-name.md) 속성으로 설정된 프로젝트 이름은 리소스를 그룹화하고 다른 애플리케이션 또는 동일한 Compose 명세 애플리케이션의 다른 설치와 구별하기 위해 사용됩니다. 플랫폼에서 리소스를 생성하는 경우 프로젝트로 리소스 이름을 접두사로 설정하고 레이블 `com.docker.compose.project`를 설정해야 합니다.

Compose는 동일한 `compose.yaml` 파일을 변경 없이 다른 이름을 전달하여 동일한 인프라에 두 번 배포할 수 있도록 사용자 정의 프로젝트 이름을 설정하고 이 이름을 재정의할 수 있는 방법을 제공합니다.

</details>

## Compose 파일 {#the-compose-file}

Compose 파일의 기본 경로는 작업 디렉토리에 배치된 `compose.yaml`(선호됨) 또는 `compose.yml`입니다.
Compose는 이전 버전의 하위 호환성을 위해 `docker-compose.yaml` 및 `docker-compose.yml`도 지원합니다.
두 파일이 모두 존재하는 경우 Compose는 표준 `compose.yaml`을 선호합니다.

Compose 파일을 효율적이고 유지 관리하기 쉽게 유지하기 위해 [프래그먼트](/reference/compose-file/fragments.md) 및 [확장](/reference/compose-file/extension.md)를 사용할 수 있습니다.

여러 Compose 파일을 함께 [병합](/reference/compose-file/merge.md)하여 애플리케이션 모델을 정의할 수 있습니다. YAML 파일의 조합은 설정한 Compose 파일 순서에 따라 YAML 요소를 추가하거나 재정의하여 구현됩니다.
단순 속성과 맵은 가장 높은 순서의 Compose 파일에 의해 재정의되고, 목록은 추가하여 병합됩니다. 상대 경로는 보완 파일이 다른 폴더에 호스팅되는 경우 첫 번째 Compose 파일의 상위 폴더를 기준으로 해석됩니다. 일부 Compose 파일 요소는 단일 문자열 또는 복잡한 객체로 모두 표현될 수 있으므로 병합은 확장된 형식에 적용됩니다. 자세한 내용은 [여러 Compose 파일 작업](/manuals/compose/how-tos/multiple-compose-files/_index.md)을 참조하십시오.

다른 Compose 파일을 재사용하거나 애플리케이션 모델의 일부를 별도의 Compose 파일로 분리하려는 경우 [`include`](/reference/compose-file/include.md)를 사용할 수도 있습니다. 이는 Compose 애플리케이션이 다른 팀에서 관리하는 다른 애플리케이션에 의존하거나 다른 사람과 공유해야 하는 경우 유용합니다.

## CLI {#cli}

Docker CLI를 사용하면 `docker compose` 명령과 하위 명령을 통해 Docker Compose 애플리케이션과 상호 작용할 수 있습니다. CLI를 사용하면 `compose.yaml` 파일에 정의된 다중 컨테이너 애플리케이션의 수명 주기를 관리할 수 있습니다. CLI 명령을 사용하여 애플리케이션을 쉽게 시작, 중지 및 구성할 수 있습니다.

### 주요 명령 {#key-commands}

`compose.yaml` 파일에 정의된 모든 서비스를 시작하려면:

```console
$ docker compose up
```

실행 중인 서비스를 중지하고 제거하려면:

```console
$ docker compose down
```

실행 중인 컨테이너의 출력을 모니터링하고 문제를 디버그하려면 로그를 볼 수 있습니다:

```console
$ docker compose logs
```

현재 상태와 함께 모든 서비스를 나열하려면:

```console
$ docker compose ps
```

모든 Compose CLI 명령의 전체 목록은 [참조 문서](/reference/cli/docker/compose/_index.md)를 참조하십시오.

## 예시 {#illustrative-example}

다음 예시는 위에서 설명한 Compose 개념을 설명합니다. 이 예시는 비규범적입니다.

프론트엔드 웹 애플리케이션과 백엔드 서비스로 나뉜 애플리케이션을 고려하십시오.

프론트엔드는 인프라에서 관리하는 HTTP 구성 파일로 런타임에 구성되며, 플랫폼의 보안 비밀 저장소에서 주입된 외부 도메인 이름과 HTTPS 서버 인증서를 제공합니다.

백엔드는 영구 볼륨에 데이터를 저장합니다.

두 서비스는 격리된 백티어 네트워크에서 서로 통신하며, 프론트엔드는 또한 프론트티어 네트워크에 연결되어 외부 사용을 위해 포트 443을 노출합니다.

![Compose application example](../images/compose-application.webp)

예시 애플리케이션은 다음과 같은 부분으로 구성됩니다:

- Docker 이미지로 지원되는 2개의 서비스: `webapp` 및 `database`
- 프론트엔드에 주입된 1개의 비밀(HTTPS 인증서)
- 프론트엔드에 주입된 1개의 구성(HTTP)
- 백엔드에 연결된 1개의 영구 볼륨
- 2개의 네트워크

```yml
services:
  frontend:
    image: example/webapp
    ports:
      - "443:8043"
    networks:
      - front-tier
      - back-tier
    configs:
      - httpd-config
    secrets:
      - server-certificate

  backend:
    image: example/database
    volumes:
      - db-data:/etc/data
    networks:
      - back-tier

volumes:
  db-data:
    driver: flocker
    driver_opts:
      size: "10GiB"

configs:
  httpd-config:
    external: true

secrets:
  server-certificate:
    external: true

networks:
  # 이러한 객체의 존재만으로도 정의가 충분합니다
  front-tier: {}
  back-tier: {}
```

`docker compose up` 명령은 `frontend` 및 `backend` 서비스를 시작하고, 필요한 네트워크와 볼륨을 생성하며, 프론트엔드 서비스에 구성 및 비밀을 주입합니다.

`docker compose ps`는 서비스의 현재 상태를 스냅샷으로 제공하여 실행 중인 컨테이너, 상태 및 사용 중인 포트를 쉽게 확인할 수 있습니다:

```text
$ docker compose ps

NAME                IMAGE                COMMAND                  SERVICE             CREATED             STATUS              PORTS
example-frontend-1  example/webapp       "nginx -g 'daemon of…"   frontend            2 minutes ago       Up 2 minutes        0.0.0.0:443->8043/tcp
example-backend-1   example/database     "docker-entrypoint.s…"   backend             2 minutes ago       Up 2 minutes
```

## 다음 단계 {#whats-next}

- [빠른 시작](/manuals/compose/gettingstarted.md)
- [샘플 애플리케이션 탐색](/manuals/compose/support-and-feedback/samples-for-compose.md)
- [Compose 명세 익히기](/reference/compose-file/_index.md)
