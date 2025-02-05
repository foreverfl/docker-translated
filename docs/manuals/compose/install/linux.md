---
description:
  이 단계별 핸드북을 통해 Linux에 Docker Compose를 다운로드하고 설치하세요.
  이 플러그인은 수동으로 또는 저장소를 사용하여 설치할 수 있습니다.
keywords:
  - 리눅스에 도커 컴포즈 설치
  - 도커 컴포즈 리눅스
  - 도커 컴포즈 플러그인
  - docker-compose-plugin
  - 리눅스 도커 컴포즈 설치
  - 리눅스에 docker-compose 설치
  - 리눅스에 docker-compose
  - 리눅스 도커 컴포즈
  - 도커 컴포즈 v2 리눅스
  - 리눅스에 도커 컴포즈 설치
title: Docker Compose 플러그인 설치
linkTitle: 플러그인
aliases:
  - /compose/compose-plugin/
  - /compose/compose-linux/
weight: 10
---

이 페이지에는 명령줄에서 Linux에 Docker Compose 플러그인을 설치하는 방법에 대한 지침이 포함되어 있습니다.

Linux에 Docker Compose 플러그인을 설치하려면 다음 중 하나를 선택할 수 있습니다:

- [Linux 시스템에 Docker의 저장소 설정](#install-using-the-repository)
- [수동으로 설치](#install-the-plugin-manually)

:::note
이 지침은 이미 Docker Engine 및 Docker CLI가 설치되어 있고 이제 Docker Compose 플러그인을 설치하려는 경우를 가정합니다. Docker Compose 독립 실행형에 대해서는 [Docker Compose 독립 실행형 설치](standalone.md)를 참조하세요.
:::

## 저장소를 사용하여 설치 {#install-using-the-repository}

1. 저장소를 설정합니다. 배포판별 지침은 다음에서 찾을 수 있습니다:

   [Ubuntu](/manuals/engine/install/ubuntu.md#install-using-the-repository) |
   [CentOS](/manuals/engine/install/centos.md#set-up-the-repository) |
   [Debian](/manuals/engine/install/debian.md#install-using-the-repository) |
   [Raspberry Pi OS](/manuals/engine/install/raspberry-pi-os.md#install-using-the-repository) |
   [Fedora](/manuals/engine/install/fedora.md#set-up-the-repository) |
   [RHEL](/manuals/engine/install/rhel.md#set-up-the-repository) |
   [SLES](/manuals/engine/install/sles.md#set-up-the-repository).

2. 패키지 인덱스를 업데이트하고 Docker Compose의 최신 버전을 설치합니다:

   - Ubuntu 및 Debian의 경우, 다음을 실행합니다:

     ```bash
     $ sudo apt-get update
     $ sudo apt-get install docker-compose-plugin
     ```

   - RPM 기반 배포판의 경우, 다음을 실행합니다:

     ```bash
     $ sudo yum update
     $ sudo yum install docker-compose-plugin
     ```

3. 버전을 확인하여 Docker Compose가 올바르게 설치되었는지 확인합니다.

   ```bash
   $ docker compose version
   ```

   예상 출력:

   ```text
   Docker Compose version vN.N.N
   ```

   여기서 `vN.N.N`은 최신 버전을 나타내는 자리 표시자 텍스트입니다.

### Docker Compose 업데이트 {#update-docker-compose}

Docker Compose 플러그인을 업데이트하려면 다음 명령을 실행합니다:

- Ubuntu 및 Debian의 경우, 다음을 실행합니다:

  ```bash
  $ sudo apt-get update
  $ sudo apt-get install docker-compose-plugin
  ```

- RPM 기반 배포판의 경우, 다음을 실행합니다:

  ```bash
  $ sudo yum update
  $ sudo yum install docker-compose-plugin
  ```

## 플러그인을 수동으로 설치 {#install-the-plugin-manually}

:::note
이 옵션을 선택하면 업그레이드를 수동으로 관리해야 합니다. 더 쉬운 유지 관리를 위해 Docker의 저장소를 설정하는 것이 좋습니다.
:::

1.  Docker Compose CLI 플러그인을 다운로드하고 설치하려면 다음을 실행합니다:

    ```bash
    $ DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
    $ mkdir -p $DOCKER_CONFIG/cli-plugins
    $ curl -SL https://github.com/docker/compose/releases/download//docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
    ```

    이 명령은 활성 사용자 아래의 `$HOME` 디렉토리에 Docker Compose의 최신 릴리스를 다운로드하고 설치합니다.

    설치하려면:

    - 시스템의 _모든 사용자_에 대해 Docker Compose를 설치하려면 `~/.docker/cli-plugins`를 `/usr/local/lib/docker/cli-plugins`로 바꿉니다.
    - 다른 버전의 Compose를 설치하려면 `v2.32.4`를 사용하려는 Compose 버전으로 대체합니다.
    - 다른 아키텍처를 위해서는 `x86_64`를 [원하는 아키텍처](https://github.com/docker/compose/releases)로 대체합니다.

2.  바이너리에 실행 권한을 적용합니다:

    ```bash
    $ chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose
    ```

    또는, 모든 사용자에 대해 Compose를 설치하려는 경우:

    ```bash
    $ sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    ```

3.  설치가 올바르게 되었는지 확인합니다.

    ```bash
    $ docker compose version
    ```

    예상 출력:

    ```text
    Docker Compose version
    ```
