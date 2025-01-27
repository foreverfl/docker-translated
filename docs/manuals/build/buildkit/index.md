---
title: BuildKit
weight: 100
description: 빌드킷 소개 및 개요
keywords:
  - 빌드
  - 빌드킷
---

## 개요 {#overview}

[BuildKit](https://github.com/moby/buildkit)
은 기존 빌더를 대체하기 위한 개선된 백엔드입니다. BuildKit은 Docker Desktop 및 Docker Engine 버전 23.0부터 기본 빌더입니다.

BuildKit은 새로운 기능을 제공하고 빌드 성능을 향상시킵니다.
또한 더 복잡한 시나리오를 처리하는 지원을 도입합니다:

- 사용되지 않는 빌드 단계를 감지하고 실행을 건너뜁니다
- 독립적인 빌드 단계를 병렬로 빌드합니다
- 빌드 간에 변경된 파일만 점진적으로 전송합니다
  [빌드 컨텍스트](../concepts/context.md)
- 사용되지 않는 파일의 전송을 감지하고 건너뜁니다
  [빌드 컨텍스트](../concepts/context.md)
- 많은 새로운 기능이 포함된 [Dockerfile 프론트엔드](frontend.md) 구현을 사용합니다
- API의 나머지 부분과의 부작용을 피합니다 (중간 이미지 및 컨테이너)
- 자동 정리를 위한 빌드 캐시를 우선 순위로 지정합니다

많은 새로운 기능 외에도 BuildKit이 현재 경험을 개선하는 주요 영역은 성능, 스토리지 관리 및 확장성입니다. 성능 측면에서 중요한 업데이트는 새로운 완전 동시 빌드 그래프 솔버입니다. 가능한 경우 빌드 단계를 병렬로 실행하고 최종 결과에 영향을 미치지 않는 명령을 최적화합니다. 또한 로컬 소스 파일에 대한 접근을 최적화했습니다. 반복된 빌드 호출 간에 이러한 파일에 대한 업데이트만 추적하여 로컬 파일이 읽히거나 업로드되기를 기다릴 필요 없이 작업을 시작할 수 있습니다.

## LLB {#llb}

BuildKit의 핵심은
[Low-Level Build (LLB)](https://github.com/moby/buildkit#exploring-llb) 정의 형식입니다. LLB는 개발자가 BuildKit을 확장할 수 있도록 하는 중간 바이너리 형식입니다. LLB는 매우 복잡한 빌드 정의를 구성하는 데 사용할 수 있는 콘텐츠 주소 지정 종속성 그래프를 정의합니다. 또한 Dockerfile에서 노출되지 않은 기능을 지원합니다. 예를 들어, 직접 데이터 마운팅 및 중첩 호출이 이에 해당합니다.

<!-- {{< figure src="../images/buildkit-dag.svg" class="invertible" >}} -->

빌드의 실행 및 캐싱에 대한 모든 것은 LLB에 정의되어 있습니다. 캐싱 모델은 기존 빌더와 비교하여 완전히 새로 작성되었습니다. 이미지를 비교하기 위한 휴리스틱을 사용하는 대신, LLB는 빌드 그래프와 특정 작업에 마운트된 콘텐츠의 체크섬을 직접 추적합니다. 이는 훨씬 빠르고, 더 정확하며, 이식 가능합니다. 빌드 캐시는 레지스트리에 내보낼 수 있으며, 이후 호출 시 모든 호스트에서 필요에 따라 가져올 수 있습니다.

LLB는 직접 생성할 수 있습니다
[golang 클라이언트 패키지](https://pkg.go.dev/github.com/moby/buildkit/client/llb)를 사용하여 빌드 작업 간의 관계를 Go 언어 기본 요소를 사용하여 정의할 수 있습니다. 이를 통해 상상할 수 있는 모든 것을 실행할 수 있는 완전한 권한을 제공하지만, 대부분의 사람들이 빌드를 정의하는 방식은 아닐 것입니다. 대신 대부분의 사용자는 프론트엔드 구성 요소 또는 LLB 중첩 호출을 사용하여 준비된 빌드 단계를 실행할 것입니다.

## 프론트엔드 {#frontend}

프론트엔드는 사람이 읽을 수 있는 빌드 형식을 LLB로 변환하여 BuildKit이 실행할 수 있도록 하는 구성 요소입니다. 프론트엔드는 이미지로 배포될 수 있으며, 사용자는 정의에서 사용된 기능에 대해 작동이 보장된 특정 버전의 프론트엔드를 타겟팅할 수 있습니다.

예를 들어, [Dockerfile](/reference/dockerfile.md)을 사용하여
BuildKit으로 빌드하려면,
[외부 Dockerfile 프론트엔드](frontend.md)를 사용합니다.

## 시작하기 {#getting-started}

BuildKit은 Docker Desktop 및 Docker Engine v23.0 이상 버전의 기본 빌더입니다.

Docker Desktop을 설치한 경우 BuildKit을 활성화할 필요가 없습니다. Docker Engine 버전 23.0 이전 버전을 실행 중인 경우, 환경 변수를 설정하거나 데몬 구성에서 BuildKit을 기본 설정으로 만들어 BuildKit을 활성화할 수 있습니다.

`docker build` 명령을 실행할 때 BuildKit 환경 변수를 설정하려면 다음을 실행하십시오:

```bash
$ DOCKER_BUILDKIT=1 docker build .
```

:::note
Buildx는 항상 BuildKit을 사용합니다.
:::

Docker BuildKit을 기본값으로 사용하려면, Docker 데몬 구성에서 `/etc/docker/daemon.json`을 다음과 같이 편집하고 데몬을 다시 시작하십시오.

```json
{
  "features": {
    "buildkit": true
  }
}
```

`/etc/docker/daemon.json` 파일이 없는 경우, `daemon.json`이라는 새 파일을 만들고 다음을 파일에 추가하십시오. 그런 다음 Docker 데몬을 다시 시작하십시오.

## Windows에서 BuildKit 사용 {#buildkit-on-windows}

:::warning
BuildKit은 Linux 컨테이너 빌드만 완전히 지원합니다.
Windows 컨테이너 지원은 실험적이며, [`moby/buildkit#616`](https://github.com/moby/buildkit/issues/616)에서 추적됩니다.
:::

BuildKit은 버전 0.13부터 Windows 컨테이너(WCOW)에 대한 실험적 지원을 제공합니다.
이 섹션에서는 이를 시도하는 단계를 안내합니다.
특히 `buildkitd.exe`에 대해 [여기에서 이슈를 열어](https://github.com/moby/buildkit/issues/new) 제출한 피드백을 환영합니다.

### 알려진 제한 사항 {#known-limitations}

- BuildKit은 현재 `containerd` 작업자만 지원합니다.
  비-OCI 작업자에 대한 지원은 [moby/buildkit#4836](https://github.com/moby/buildkit/issues/4836)에서 추적됩니다.

### 사전 요구 사항 {#prerequisites}

- 아키텍처: `amd64`, `arm64` (바이너리는 사용 가능하지만 아직 공식적으로 테스트되지 않음).
- 지원되는 OS: Windows Server 2019, Windows Server 2022, Windows 11.
- 기본 이미지: `ServerCore:ltsc2019`, `ServerCore:ltsc2022`, `NanoServer:ltsc2022`.
  [호환성 맵을 여기에서 확인하십시오](https://learn.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-2019%2Cwindows-11#windows-server-host-os-compatibility).
- Docker Desktop 버전 4.29 이상

### 단계 {#steps}

:::note
다음 명령은 PowerShell 터미널에서 관리자(승격된) 권한이 필요합니다.
:::

1. **Hyper-V** 및 **Containers** Windows 기능을 활성화합니다.

   ```bash
   > Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V, Containers -All
   ```

   `RestartNeeded`가 `True`로 표시되면, 컴퓨터를 다시 시작하고 관리자 권한으로 PowerShell 터미널을 다시 엽니다.
   그렇지 않으면 다음 단계로 계속 진행하십시오.

2. Docker Desktop에서 Windows 컨테이너로 전환합니다.

   작업 표시줄에서 Docker 아이콘을 선택하고, **Switch to Windows containers...** 를 선택합니다.

3. containerd 버전 1.7.7 이상을 설치합니다. 설치 지침은 [여기](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#installing-containerd-on-windows)를 참조하십시오.

4. 최신 BuildKit 릴리스를 다운로드하고 압축을 풉니다.

   ```powershell
   $version = "v0.13.1" # 릴리스 버전을 지정합니다, v0.13+
   $arch = "amd64" # arm64 바이너리도 사용 가능
   curl.exe -LO https://github.com/moby/buildkit/releases/download/$version/buildkit-$version.windows-$arch.tar.gz
   # containerd 지침에서 또 다른 `.\bin` 디렉토리가 있을 수 있습니다
   # 이를 이동할 수 있습니다
   mv bin bin2
   tar.exe xvf .\buildkit-$version.windows-$arch.tar.gz
   ## x bin/
   ## x bin/buildctl.exe
   ## x bin/buildkitd.exe
   ```

5. `PATH`에 BuildKit 바이너리를 설치합니다.

   ```powershell
   # 바이너리가 bin 디렉토리에 압축 해제된 후
   # 이를 $Env:PATH 디렉토리의 적절한 경로로 이동하거나:
   Copy-Item -Path ".\bin" -Destination "$Env:ProgramFiles\buildkit" -Recurse -Force
   # $Env:PATH에 `buildkitd.exe` 및 `buildctl.exe` 바이너리를 추가합니다
   $Path = [Environment]::GetEnvironmentVariable("PATH", "Machine") + `
       [IO.Path]::PathSeparator + "$Env:ProgramFiles\buildkit"
   [Environment]::SetEnvironmentVariable( "Path", $Path, "Machine")
   $Env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + `
       [System.Environment]::GetEnvironmentVariable("Path","User")
   ```

6. BuildKit 데몬을 시작합니다.

   ```bash
   > buildkitd.exe
   ```

7. 관리자 권한이 있는 다른 터미널에서 로컬 BuildKit 데몬을 사용하는 원격 빌더를 만듭니다.

   :::note
   Docker Desktop 버전 4.29 이상이 필요합니다.
   :::

   ```bash
   > docker buildx create --name buildkit-exp --use --driver=remote npipe:////./pipe/buildkitd
   buildkit-exp
   ```

8. `docker buildx inspect` 명령을 실행하여 빌더 연결을 확인합니다.

   ```bash
   > docker buildx inspect
   ```

   출력은 빌더 플랫폼이 Windows이며,
   빌더의 엔드포인트가 명명된 파이프임을 나타내야 합니다.

   ```text
   Name:          buildkit-exp
    Driver:        remote
    Last Activity: 2024-04-15 17:51:58 +0000 UTC
    Nodes:
    Name:             buildkit-exp0
    Endpoint:         npipe:////./pipe/buildkitd
    Status:           running
    BuildKit version: v0.13.1
    Platforms:        windows/amd64
   ...
   ```

9. Dockerfile을 만들고 `hello-buildkit` 이미지를 빌드합니다.

   ```bash
   > mkdir sample_dockerfile
   > cd sample_dockerfile
   > Set-Content Dockerfile @"
   FROM mcr.microsoft.com/windows/nanoserver:ltsc2022
   USER ContainerAdministrator
   COPY hello.txt C:/
   RUN echo "Goodbye!" >> hello.txt
   CMD ["cmd", "/C", "type C:\\hello.txt"]
   "@
   Set-Content hello.txt @"
   Hello from BuildKit!
   This message shows that your installation appears to be working correctly.
   "@
   ```

10. 이미지를 빌드하고 레지스트리에 푸시합니다.

    ```bash
    > docker buildx build --push -t <username>/hello-buildkit .
    ```

11. 레지스트리에 푸시한 후, `docker run` 명령으로 이미지를 실행합니다.

    ```bash
    > docker run <username>/hello-buildkit
    ```
