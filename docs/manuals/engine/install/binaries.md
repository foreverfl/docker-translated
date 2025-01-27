---
description: Docker를 바이너리로 설치하는 방법을 배웁니다. 이 지침은 테스트 목적으로 가장 적합합니다.
keywords:
  - 바이너리
  - 설치
  - 도커
  - 문서
  - 리눅스
  - 도커 엔진 설치
title: 바이너리로 Docker Engine 설치
linkTitle: Binaries
weight: 80
aliases:
  - /engine/installation/binaries/
  - /engine/installation/linux/docker-ce/binaries/
  - /install/linux/docker-ce/binaries/
  - /installation/binaries/
---

:::important
이 페이지에는 바이너리를 사용하여 Docker를 설치하는 방법에 대한 정보가 포함되어 있습니다. 이 지침은 주로 테스트 목적으로 적합합니다. 바이너리를 사용하여 Docker를 설치하는 것은 자동 보안 업데이트가 없기 때문에 프로덕션 환경에서는 권장하지 않습니다. 이 페이지에 설명된 Linux 바이너리는 정적으로 링크되어 있으므로 빌드 시점 종속성의 취약점이 Linux 배포판의 보안 업데이트로 자동으로 패치되지 않습니다.

바이너리를 업데이트하는 것도 패키지 관리자나 Docker Desktop을 사용하여 설치된 Docker 패키지에 비해 약간 더 복잡합니다. 새로운 Docker 릴리스가 있을 때마다 설치된 버전을 수동으로 업데이트해야 합니다.

또한, 정적 바이너리에는 동적 패키지가 제공하는 모든 기능이 포함되지 않을 수 있습니다.
Windows 및 Mac에서는 [Docker Desktop](/manuals/desktop/_index.md)을 설치하는 것이 좋습니다. Linux에서는 배포판에 맞는 지침을 따르는 것이 좋습니다.
:::

Docker를 시도하거나 테스트 환경에서 사용하고 싶지만 지원되는 플랫폼에 있지 않은 경우, 정적 바이너리를 설치해 볼 수 있습니다. 가능하면 운영 체제용으로 빌드된 패키지를 사용하고 운영 체제의 패키지 관리 시스템을 사용하여 Docker 설치 및 업그레이드를 관리해야 합니다.

Docker 데몬 바이너리의 정적 바이너리는 Linux( `dockerd`) 및 Windows( `dockerd.exe`)에서만 사용할 수 있습니다.
Docker 클라이언트의 정적 바이너리는 Linux, Windows 및 macOS( `docker`)에서 사용할 수 있습니다.

이 주제에서는 Linux, Windows 및 macOS에 대한 바이너리 설치에 대해 설명합니다:

- [Linux에 데몬 및 클라이언트 바이너리 설치](#install-daemon-and-client-binaries-on-linux)
- [macOS에 클라이언트 바이너리 설치](#install-client-binaries-on-macos)
- [Windows에 서버 및 클라이언트 바이너리 설치](#install-server-and-client-binaries-on-windows)

## Linux에 데몬 및 클라이언트 바이너리 설치 {#install-daemon-and-client-binaries-on-linux}

### 사전 요구 사항 {#prerequisites}

바이너리를 사용하여 Docker를 설치하기 전에 호스트 머신이 다음 요구 사항을 충족하는지 확인하십시오:

- 64비트 설치
- Linux 커널 버전 3.10 이상. 플랫폼에서 사용할 수 있는 최신 커널 버전을 권장합니다.
- `iptables` 버전 1.4 이상
- `git` 버전 1.7 이상
- `ps` 실행 파일, 일반적으로 `procps` 또는 유사한 패키지에서 제공됩니다.
- [XZ Utils](https://tukaani.org/xz/) 4.9 이상
- [적절하게 마운트된](https://github.com/tianon/cgroupfs-mount/blob/master/cgroupfs-mount) `cgroupfs` 계층 구조; 단일, 모든 것을 포함하는 `cgroup` 마운트 포인트는 충분하지 않습니다. Github 이슈 참조
  [#2683](https://github.com/moby/moby/issues/2683),
  [#3485](https://github.com/moby/moby/issues/3485),
  [#4568](https://github.com/moby/moby/issues/4568)).

#### 가능한 한 환경을 안전하게 보호하십시오 {#secure-your-environment-as-much-as-possible}

##### OS 고려 사항 {#os-considerations}

가능하면 SELinux 또는 AppArmor를 활성화하십시오.

Linux 배포판이 두 가지 중 하나를 지원하는 경우 AppArmor 또는 SELinux를 사용하는 것이 좋습니다. 이는 보안을 향상시키고 특정 유형의 익스플로잇을 차단하는 데 도움이 됩니다. AppArmor 또는 SELinux를 활성화하고 구성하는 방법에 대한 지침은 Linux 배포판의 문서를 참조하십시오.

> **보안 경고**
>
> 두 보안 메커니즘 중 하나가 활성화된 경우 Docker 또는 컨테이너를 실행하기 위한 해결 방법으로 비활성화하지 마십시오. 대신, 문제를 해결하기 위해 올바르게 구성하십시오.

##### Docker 데몬 고려 사항 {#docker-daemon-considerations}

- 가능하면 `seccomp` 보안 프로필을 활성화하십시오. 참조
  [Docker에 대한 `seccomp` 활성화](../security/seccomp.md).

- 가능하면 사용자 네임스페이스를 활성화하십시오. 참조
  [데몬 사용자 네임스페이스 옵션](/reference/cli/dockerd/#daemon-user-namespace-options).

### 정적 바이너리 설치 {#install-static-binaries}

1.  정적 바이너리 아카이브를 다운로드합니다. [https://download.docker.com/linux/static/stable/](https://download.docker.com/linux/static/stable/)로 이동하여 하드웨어 플랫폼을 선택하고 설치하려는 Docker Engine 버전과 관련된 `.tgz` 파일을 다운로드합니다.

2.  `tar` 유틸리티를 사용하여 아카이브를 추출합니다. `dockerd` 및 `docker` 바이너리가 추출됩니다.

    ```bash
    $ tar xzvf /path/to/<FILE>.tar.gz
    ```

3.  **선택 사항**: 바이너리를 `/usr/bin/`과 같은 실행 경로의 디렉토리로 이동합니다. 이 단계를 건너뛰면 `docker` 또는 `dockerd` 명령을 실행할 때 실행 파일의 경로를 제공해야 합니다.

    ```bash
    $ sudo cp docker/* /usr/bin/
    ```

4.  Docker 데몬을 시작합니다:

    ```bash
    $ sudo dockerd &
    ```

    추가 옵션으로 데몬을 시작해야 하는 경우 위 명령을 수정하거나 `/etc/docker/daemon.json` 파일을 생성 및 편집하여 사용자 정의 구성 옵션을 추가하십시오.

5.  `hello-world` 이미지를 실행하여 Docker가 올바르게 설치되었는지 확인합니다.

    ```bash
    $ sudo docker run hello-world
    ```

    이 명령은 테스트 이미지를 다운로드하고 컨테이너에서 실행합니다. 컨테이너가 실행되면 메시지를 출력하고 종료합니다.

이제 Docker Engine을 성공적으로 설치하고 시작했습니다.

<Include file="root-errors.md" />

## macOS에 클라이언트 바이너리 설치 {#install-client-binaries-on-macos}

:::note
다음 지침은 주로 테스트 목적으로 적합합니다. macOS 바이너리에는 Docker 클라이언트만 포함되어 있습니다. 컨테이너를 실행하는 데 필요한 `dockerd` 데몬은 포함되어 있지 않습니다. 따라서 [Docker Desktop](/manuals/desktop/_index.md)을 설치하는 것이 좋습니다.
:::

Mac용 바이너리에는 다음이 포함되지 않습니다:

- 런타임 환경. 가상 머신에서 또는 원격 Linux 머신에서 기능적인 엔진을 설정해야 합니다.
- `buildx` 및 `docker compose`와 같은 Docker 구성 요소.

클라이언트 바이너리를 설치하려면 다음 단계를 수행하십시오:

1.  정적 바이너리 아카이브를 다운로드합니다. [https://download.docker.com/mac/static/stable/](https://download.docker.com/mac/static/stable/)로 이동하여 `x86_64`(Intel 칩용 Mac) 또는 `aarch64`(Apple 실리콘용 Mac)를 선택한 다음 설치하려는 Docker Engine 버전과 관련된 `.tgz` 파일을 다운로드합니다.

2.  `tar` 유틸리티를 사용하여 아카이브를 추출합니다. `docker` 바이너리가 추출됩니다.

    ```bash
    $ tar xzvf /path/to/<FILE>.tar.gz
    ```

3.  실행할 수 있도록 확장 속성을 지웁니다.

    ```bash
    $ sudo xattr -rc docker
    ```

    이제 다음 명령을 실행하면 Docker CLI 사용 지침을 볼 수 있습니다:

    ```bash
    $ docker/docker
    ```

4.  **선택 사항**: 바이너리를 `/usr/local/bin/`과 같은 실행 경로의 디렉토리로 이동합니다. 이 단계를 건너뛰면 `docker` 또는 `dockerd` 명령을 실행할 때 실행 파일의 경로를 제공해야 합니다.

    ```bash
    $ sudo cp docker/docker /usr/local/bin/
    ```

5.  `hello-world` 이미지를 실행하여 Docker가 올바르게 설치되었는지 확인합니다. `<hostname>`의 값은 Docker 데몬을 실행하고 클라이언트에서 액세스할 수 있는 호스트 이름 또는 IP 주소입니다.

    ```bash
    $ sudo docker -H <hostname> run hello-world
    ```

    이 명령은 테스트 이미지를 다운로드하고 컨테이너에서 실행합니다. 컨테이너가 실행되면 메시지를 출력하고 종료합니다.

## Windows에 서버 및 클라이언트 바이너리 설치 {#install-server-and-client-binaries-on-windows}

> [!NOTE]
>
> 다음 섹션에서는 Windows Server에서 Docker 데몬을 설치하는 방법을 설명합니다. 이를 통해 Windows 컨테이너만 실행할 수 있습니다. Windows Server에 Docker 데몬을 설치하면 `buildx` 및 `compose`와 같은 Docker 구성 요소가 포함되지 않습니다. Windows 10 또는 11을 실행 중인 경우 [Docker Desktop](/manuals/desktop/_index.md)을 설치하는 것이 좋습니다.

Windows의 바이너리 패키지에는 `dockerd.exe` 및 `docker.exe`가 모두 포함됩니다. Windows에서는 이러한 바이너리가 네이티브 Windows 컨테이너(리눅스 컨테이너 아님)를 실행할 수 있는 기능만 제공합니다.

서버 및 클라이언트 바이너리를 설치하려면 다음 단계를 수행하십시오:

1. 정적 바이너리 아카이브를 다운로드합니다. [https://download.docker.com/win/static/stable/x86_64](https://download.docker.com/win/static/stable/x86_64)로 이동하여 목록에서 최신 버전을 선택합니다.

2. PowerShell 명령을 실행하여 아카이브를 프로그램 파일에 설치하고 추출합니다:

   ```powershell
   PS C:\> Expand-Archive /path/to/<FILE>.zip -DestinationPath $Env:ProgramFiles
   ```

3. 서비스를 등록하고 Docker Engine을 시작합니다:

   ```powershell
   PS C:\> &$Env:ProgramFiles\Docker\dockerd --register-service
   PS C:\> Start-Service docker
   ```

4. `hello-world` 이미지를 실행하여 Docker가 올바르게 설치되었는지 확인합니다.

   ```powershell
   PS C:\> &$Env:ProgramFiles\Docker\docker run hello-world:nanoserver
   ```

   이 명령은 테스트 이미지를 다운로드하고 컨테이너에서 실행합니다. 컨테이너가 실행되면 메시지를 출력하고 종료합니다.

## 정적 바이너리 업그레이드 {#upgrade-static-binaries}

Docker Engine의 수동 설치를 업그레이드하려면 먼저 로컬에서 실행 중인 모든 `dockerd` 또는 `dockerd.exe` 프로세스를 중지한 다음 기존 버전 위에 새 버전을 설치하는 일반 설치 단계를 따르십시오.

## 다음 단계 {#next-steps}

- [Linux의 설치 후 단계](linux-postinstall.md)를 계속 진행하십시오.
