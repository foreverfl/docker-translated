---
description:
  Ubuntu에서 Docker Engine으로 클라이언트 측 서버 애플리케이션을 빠르게 시작하세요. 이 가이드는 Ubuntu에서 Docker Engine을 설치하는 여러 방법과 사전 요구 사항을 자세히 설명합니다.
keywords:
  - 도커 설치 스크립트
  - 우분투 도커 서버
  - 우분투 서버 도커
  - 도커 엔진 우분투 설치
  - 우분투 서버에 도커 설치
  - 우분투 22.04 도커-ce
  - 우분투에 도커 엔진 설치
  - 우분투 도커 ce 설치
  - 우분투 도커 엔진 설치
title: 우분투에 Docker Engine 설치
linkTitle: Ubuntu
weight: 10
toc_max: 4
aliases:
  - /ee/docker-ee/ubuntu/
  - /engine/installation/linux/docker-ce/ubuntu/
  - /engine/installation/linux/docker-ee/ubuntu/
  - /engine/installation/linux/ubuntu/
  - /engine/installation/linux/ubuntulinux/
  - /engine/installation/ubuntulinux/
  - /install/linux/docker-ce/ubuntu/
  - /install/linux/docker-ee/ubuntu/
  - /install/linux/ubuntu/
  - /installation/ubuntulinux/
download-url-base: https://download.docker.com/linux/ubuntu
---

Docker Engine을 Ubuntu에 설치하려면 [사전 요구 사항](#prerequisites)을 충족한 후 [설치 단계](#installation-methods)를 따르세요.

## 사전 요구 사항 {#prerequisites}

### 방화벽 제한 사항 {#firewall-limitations}

:::warning
Docker를 설치하기 전에 다음 보안 문제와 방화벽 비호환성을 고려하세요.
:::

- ufw 또는 firewalld를 사용하여 방화벽 설정을 관리하는 경우, Docker를 사용하여 컨테이너 포트를 노출할 때 이러한 포트가 방화벽 규칙을 우회한다는 점을 유의하세요. 자세한 내용은 [Docker와 ufw](/manuals/engine/network/packet-filtering-firewalls.md#docker-and-ufw)를 참조하세요.
- Docker는 `iptables-nft` 및 `iptables-legacy`와만 호환됩니다. Docker가 설치된 시스템에서는 `nft`로 생성된 방화벽 규칙이 지원되지 않습니다. 사용하는 방화벽 규칙 세트가 `iptables` 또는 `ip6tables`로 생성되었는지 확인하고, 이를 `DOCKER-USER` 체인에 추가하세요. 자세한 내용은 [패킷 필터링 및 방화벽](/manuals/engine/network/packet-filtering-firewalls.md)을 참조하세요.

### 운영 체제 요구 사항 {#os-requirements}

Docker Engine을 설치하려면 다음 Ubuntu 버전 중 64비트 버전이 필요합니다:

- Ubuntu Oracular 24.10
- Ubuntu Noble 24.04 (LTS)
- Ubuntu Jammy 22.04 (LTS)
- Ubuntu Focal 20.04 (LTS)

Ubuntu용 Docker Engine은 x86_64 (또는 amd64), armhf, arm64, s390x 및 ppc64le (ppc64el) 아키텍처와 호환됩니다.

### 이전 버전 제거 {#uninstall-old-versions}

Docker Engine을 설치하기 전에 충돌하는 패키지를 제거해야 합니다.

Linux 배포판에서 제공하는 비공식 Docker 패키지는 Docker에서 제공하는 공식 패키지와 충돌할 수 있습니다. 공식 Docker Engine 버전을 설치하기 전에 이러한 패키지를 제거해야 합니다.

제거할 비공식 패키지는 다음과 같습니다:

- `docker.io`
- `docker-compose`
- `docker-compose-v2`
- `docker-doc`
- `podman-docker`

또한, Docker Engine은 `containerd` 및 `runc`에 의존합니다. Docker Engine은 이러한 종속성을 하나의 번들로 묶어 제공합니다: `containerd.io`. 이전에 `containerd` 또는 `runc`를 설치한 경우, Docker Engine과 번들로 제공되는 버전과 충돌하지 않도록 제거하세요.

다음 명령을 실행하여 충돌하는 모든 패키지를 제거하세요:

```console
$ for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

`apt-get`은 이러한 패키지가 설치되지 않았음을 보고할 수 있습니다.

Docker를 제거할 때 `/var/lib/docker/`에 저장된 이미지, 컨테이너, 볼륨 및 네트워크는 자동으로 제거되지 않습니다. 깨끗한 설치를 원하고 기존 데이터를 정리하려면 [Docker Engine 제거](#uninstall-docker-engine) 섹션을 참조하세요.

## 설치 방법 {#installation-methods}

필요에 따라 Docker Engine을 다양한 방법으로 설치할 수 있습니다:

- [Docker Desktop for Linux](/manuals/desktop/setup/install/linux/_index.md)에 Docker Engine이 번들로 제공됩니다. 이는 가장 쉽고 빠르게 시작할 수 있는 방법입니다.

- Docker의 `apt` 저장소에서 Docker Engine을 설정하고 설치합니다. [저장소를 사용하여 설치](#install-using-the-repository)를 참조하세요.

- [수동으로 설치](#install-from-a-package)하고 수동으로 업그레이드를 관리합니다.

- [편의 스크립트](#install-using-the-convenience-script)를 사용합니다. 테스트 및 개발 환경에서만 권장됩니다.

### `apt` 저장소를 사용하여 설치 {#install-using-the-repository}

새 호스트 머신에 처음으로 Docker Engine을 설치하기 전에 Docker `apt` 저장소를 설정해야 합니다. 이후에는 저장소에서 Docker를 설치하고 업데이트할 수 있습니다.

1. Docker의 `apt` 저장소를 설정합니다.

   ```bash
   # Docker의 공식 GPG 키 추가:
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL /gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc

   # 저장소를 Apt 소스에 추가:
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc]  \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   ```

   :::note
   Ubuntu 파생 배포판(예: Linux Mint)을 사용하는 경우 `VERSION_CODENAME` 대신 `UBUNTU_CODENAME`을 사용해야 할 수 있습니다.
   :::

2. Docker 패키지를 설치합니다.

   <Tabs>
   <TabItem value="latest" label="최신">

   최신 버전을 설치하려면 다음을 실행하세요:

   ```console
   $ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

   </TabItem>
   <TabItem value="specific-version" label="특정 버전">

   Docker Engine의 특정 버전을 설치하려면 먼저 저장소에서 사용 가능한 버전을 나열하세요:

   ```console
   # 사용 가능한 버전 나열:
   $ apt-cache madison docker-ce | awk '{ print $3 }'

   5:-1~ubuntu.24.04~noble
   5:-1~ubuntu.24.04~noble
   ...
   ```

   원하는 버전을 선택하고 설치하세요:

   ```console
   $ VERSION_STRING=5:-1~ubuntu.24.04~noble
   $ sudo apt-get install docker-ce=$VERSION_STRING docker-ce-cli=$VERSION_STRING containerd.io docker-buildx-plugin docker-compose-plugin
   ```

   </TabItem>
   </Tabs>

3. `hello-world` 이미지를 실행하여 설치가 성공했는지 확인하세요:

   ```console
   $ sudo docker run hello-world
   ```

   이 명령은 테스트 이미지를 다운로드하고 컨테이너에서 실행합니다. 컨테이너가 실행되면 확인 메시지를 출력하고 종료합니다.

이제 Docker Engine을 성공적으로 설치하고 시작했습니다.

<Include file="root-errors.md" />

#### Docker Engine 업그레이드 {#upgrade-docker-engine}

Docker Engine을 업그레이드하려면 [설치 지침](#install-using-the-repository)의 2단계를 따라 원하는 새 버전을 선택하여 설치하세요.

### 패키지에서 설치 {#install-from-a-package}

Docker의 `apt` 저장소를 사용하여 Docker Engine을 설치할 수 없는 경우, 릴리스에 맞는 `deb` 파일을 다운로드하여 수동으로 설치할 수 있습니다. Docker Engine을 업그레이드할 때마다 새 파일을 다운로드해야 합니다.

<!-- markdownlint-disable-next-line -->

1. [`/dists/`](/dists/)로 이동합니다.

2. 목록에서 Ubuntu 버전을 선택합니다.

3. `pool/stable/`로 이동하여 해당 아키텍처(`amd64`, `armhf`, `arm64`, 또는 `s390x`)를 선택합니다.

4. Docker Engine, CLI, containerd 및 Docker Compose 패키지에 대한 다음 `deb` 파일을 다운로드합니다:

   - `containerd.io_<version>_<arch>.deb`
   - `docker-ce_<version>_<arch>.deb`
   - `docker-ce-cli_<version>_<arch>.deb`
   - `docker-buildx-plugin_<version>_<arch>.deb`
   - `docker-compose-plugin_<version>_<arch>.deb`

5. `.deb` 패키지를 설치합니다. 다음 예제에서 Docker 패키지를 다운로드한 경로로 경로를 업데이트합니다.

   ```console
   $ sudo dpkg -i ./containerd.io_<version>_<arch>.deb \
     ./docker-ce_<version>_<arch>.deb \
     ./docker-ce-cli_<version>_<arch>.deb \
     ./docker-buildx-plugin_<version>_<arch>.deb \
     ./docker-compose-plugin_<version>_<arch>.deb
   ```

   Docker 데몬이 자동으로 시작됩니다.

6. `hello-world` 이미지를 실행하여 설치가 성공했는지 확인하세요:

   ```console
   $ sudo service docker start
   $ sudo docker run hello-world
   ```

   이 명령은 테스트 이미지를 다운로드하고 컨테이너에서 실행합니다. 컨테이너가 실행되면 확인 메시지를 출력하고 종료합니다.

이제 Docker Engine을 성공적으로 설치하고 시작했습니다.

<Include file="root-errors.md" />

#### Docker Engine 업그레이드 {#upgrade-docker-engine}

Docker Engine을 업그레이드하려면 새 패키지 파일을 다운로드하고 [설치 절차](#install-from-a-package)를 반복하여 새 파일을 가리키세요.

<Include file="install-script.md" />

## Docker Engine 제거 {#uninstall-docker-engine}

1. Docker Engine, CLI, containerd 및 Docker Compose 패키지를 제거합니다:

   ```console
   $ sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
   ```

2. 호스트에 있는 이미지, 컨테이너, 볼륨 또는 사용자 정의 구성 파일은 자동으로 제거되지 않습니다. 모든 이미지, 컨테이너 및 볼륨을 삭제하려면:

   ```console
   $ sudo rm -rf /var/lib/docker
   $ sudo rm -rf /var/lib/containerd
   ```

3. 소스 목록 및 키링 제거

   ```console
   $ sudo rm /etc/apt/sources.list.d/docker.list
   $ sudo rm /etc/apt/keyrings/docker.asc
   ```

편집된 구성 파일은 수동으로 삭제해야 합니다.

## 다음 단계 {#next-steps}

- [Linux의 설치 후 단계](linux-postinstall.md)를 계속 진행하세요.
