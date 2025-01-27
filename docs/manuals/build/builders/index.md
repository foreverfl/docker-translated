---
title: 빌더
weight: 40
keywords:
  - 빌드
  - buildx
  - 빌더
  - buildkit
  - 드라이버
  - 백엔드
description: 빌더와 이를 관리하는 방법에 대해 알아보세요
---

빌더는 빌드를 실행하는 데 사용할 수 있는 BuildKit 데몬입니다. BuildKit은 Dockerfile의 빌드 단계를 해결하여 컨테이너 이미지 또는 기타 아티팩트를 생성하는 빌드 엔진입니다.

빌더를 생성하고 관리하며, 이를 검사하고 원격으로 실행 중인 빌더에 연결할 수도 있습니다. Docker CLI를 사용하여 빌더와 상호 작용합니다.

## 기본 빌더 {#default-builder}

Docker Engine은 자동으로 빌더를 생성하여 빌드의 기본 백엔드가 됩니다. 이 빌더는 데몬과 함께 번들된 BuildKit 라이브러리를 사용합니다. 이 빌더는 별도의 구성이 필요하지 않습니다.

기본 빌더는 Docker 데몬 및 그 [컨텍스트](/manuals/engine/manage-resources/contexts.md)에 직접 연결됩니다. Docker 컨텍스트를 변경하면 `default` 빌더가 새로운 Docker 컨텍스트를 참조합니다.

## 빌드 드라이버 {#build-drivers}

Buildx는 다양한 빌더 구성을 참조하기 위해 [빌드 드라이버](drivers/_index.md) 개념을 구현합니다. 데몬에 의해 생성된 기본 빌더는 [`docker` 드라이버](drivers/docker.md)를 사용합니다.

Buildx는 다음 빌드 드라이버를 지원합니다:

- `docker`: Docker 데몬에 번들된 BuildKit 라이브러리를 사용합니다.
- `docker-container`: Docker를 사용하여 전용 BuildKit 컨테이너를 생성합니다.
- `kubernetes`: Kubernetes 클러스터에서 BuildKit 파드를 생성합니다.
- `remote`: 수동으로 관리되는 BuildKit 데몬에 직접 연결합니다.

## 선택된 빌더 {#selected-builder}

선택된 빌더는 빌드 명령을 실행할 때 기본적으로 사용되는 빌더를 의미합니다.

빌드를 실행하거나 CLI를 사용하여 빌더와 상호 작용할 때, 선택적으로 `--builder` 플래그 또는 `BUILDX_BUILDER` [환경 변수](../building/variables.md#buildx_builder)를 사용하여 이름으로 빌더를 지정할 수 있습니다. 빌더를 지정하지 않으면 선택된 빌더가 사용됩니다.

사용 가능한 빌더 인스턴스를 보려면 `docker buildx ls` 명령을 사용하세요. 빌더 이름 옆의 별표(`*`)는 선택된 빌더를 나타냅니다.

```bash
$ docker buildx ls
NAME/NODE       DRIVER/ENDPOINT      STATUS   BUILDKIT PLATFORMS
default *       docker
  default       default              running  v0.11.6  linux/amd64, linux/amd64/v2, linux/amd64/v3, linux/386
my_builder      docker-container
  my_builder0   default              running  v0.11.6  linux/amd64, linux/amd64/v2, linux/amd64/v3, linux/386
```

### 다른 빌더 선택 {#select-a-different-builder}

빌더 간 전환하려면 `docker buildx use <name>` 명령을 사용하세요.

이 명령을 실행한 후, 지정한 빌더가 빌드를 호출할 때 자동으로 선택됩니다.

### `docker build`와 `docker buildx build`의 차이점 {#difference-between-docker-build-and-docker-buildx-build}

`docker build`는 `docker buildx build`의 별칭이지만, 두 명령 간에는 미묘한 차이가 있습니다. Buildx를 사용하면 빌드 클라이언트와 데몬(BuildKit)이 분리됩니다. 이는 단일 클라이언트에서 여러 빌더, 심지어 원격 빌더도 사용할 수 있음을 의미합니다.

`docker build` 명령은 항상 Docker Engine과 함께 번들된 기본 빌더를 사용하여 이전 버전의 Docker CLI와의 호환성을 보장합니다. 반면에 `docker buildx build` 명령은 빌드를 BuildKit에 보내기 전에 다른 빌더를 기본 빌더로 설정했는지 확인합니다.

기본 빌더가 아닌 빌더를 사용하여 `docker build` 명령을 사용하려면 다음 중 하나를 수행해야 합니다:

- `--builder` 플래그 또는 `BUILDX_BUILDER` 환경 변수를 사용하여 빌더를 명시적으로 지정합니다:

  ```bash
  $ BUILDX_BUILDER=my_builder docker build .
  $ docker build --builder my_builder .
  ```

- 다음 명령을 실행하여 Buildx를 기본 클라이언트로 구성합니다:

  ```bash
  $ docker buildx install
  ```

  이는 [Docker CLI 구성 파일](/reference/cli/docker/_index.md#configuration-files)을 업데이트하여 모든 빌드 관련 명령이 Buildx를 통해 라우팅되도록 합니다.

  :::tip
  이 변경 사항을 되돌리려면 `docker buildx uninstall`을 실행하세요.
  :::

<!-- vale Docker.We = NO -->

일반적으로, 사용자 정의 빌더를 사용하려면 `docker buildx build` 명령을 사용하는 것이 좋습니다. 이는 [선택된 빌더](#selected-builder) 구성이 올바르게 해석되도록 보장합니다.

<!-- vale Docker.We = YES -->

## 추가 정보 {#additional-information}

- 빌더와 상호 작용하고 이를 관리하는 방법에 대한 정보는 [빌더 관리](./manage.md)를 참조하세요.
- 다양한 유형의 빌더에 대해 알아보려면 [빌드 드라이버](drivers/_index.md)를 참조하세요.
