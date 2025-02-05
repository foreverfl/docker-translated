---
description: Docker 플랫폼에 대한 심층 개요, 사용 용도, 아키텍처 및 기본 기술을 알아보세요.
keywords:
  - 도커란 무엇인가
  - 도커 데몬
  - 왜 도커를 사용해야 하는가
  - 도커 아키텍처
  - 도커 사용 용도
  - 도커 클라이언트
  - 도커의 용도
  - 왜 도커인가
  - 도커의 사용 사례
  - 도커 컨테이너의 사용 용도
  - 도커 컨테이너의 사용 사례
title: 도커란 무엇인가?
weight: 20
aliases:
  - /introduction/understanding-docker/
  - /engine/userguide/basics/
  - /engine/introduction/understanding-docker/
  - /engine/understanding-docker/
  - /engine/docker-overview/
  - /get-started/overview/
  - /guides/docker-overview/
---

Docker는 애플리케이션을 개발, 배포 및 실행하기 위한 오픈 플랫폼입니다.
Docker를 사용하면 애플리케이션을 인프라로부터 분리하여 소프트웨어를 빠르게 제공할 수 있습니다. Docker를 사용하면 애플리케이션을 관리하는 것과 동일한 방식으로 인프라를 관리할 수 있습니다. Docker의 코드 배포, 테스트 및 배포 방법론을 활용하면 코드 작성과 프로덕션 실행 간의 지연을 크게 줄일 수 있습니다.

## Docker 플랫폼 {#the-docker-platform}

Docker는 컨테이너라는 느슨하게 격리된 환경에서 애플리케이션을 패키징하고 실행할 수 있는 기능을 제공합니다. 격리 및 보안 덕분에 주어진 호스트에서 여러 컨테이너를 동시에 실행할 수 있습니다. 컨테이너는 가볍고 애플리케이션 실행에 필요한 모든 것을 포함하고 있어 호스트에 설치된 것에 의존할 필요가 없습니다. 작업 중에 컨테이너를 공유할 수 있으며, 공유받는 모든 사람이 동일한 방식으로 작동하는 동일한 컨테이너를 받는다는 것을 확신할 수 있습니다.

Docker는 컨테이너의 전 과정 관리하기 위한 도구와 플랫폼을 제공합니다:

- 컨테이너를 사용하여 애플리케이션과 지원 구성 요소를 개발합니다.
- 컨테이너는 애플리케이션 배포 및 테스트의 단위가 됩니다.
- 준비가 되면 컨테이너 또는 오케스트레이션된 서비스로 애플리케이션을 프로덕션 환경에 배포합니다. 이는 로컬 데이터 센터, 클라우드 제공자 또는 두 가지의 혼합 환경에서도 동일하게 작동합니다.

## Docker의 용도 {#what-can-i-use-docker-for}

### 애플리케이션의 빠르고 일관된 제공 {#fast-consistent-delivery-of-your-applications}

Docker는 로컬 컨테이너를 사용하여 표준화된 환경에서 개발자가 작업할 수 있도록 하여 개발 단계를 간소화합니다. 컨테이너는 지속적 통합 및 지속적 배포(CI/CD) 워크플로우에 적합합니다.

다음은 예시 시나리오입니다:

- 개발자는 로컬에서 코드를 작성하고 Docker 컨테이너를 사용하여 동료와 작업을 공유합니다.
- Docker를 사용하여 애플리케이션을 테스트 환경에 푸시하고 자동 및 수동 테스트를 실행합니다.
- 개발자가 버그를 발견하면 개발 환경에서 수정하고 테스트 및 검증을 위해 테스트 환경에 다시 배포할 수 있습니다.
- 테스트가 완료되면 수정 사항을 고객에게 전달하는 것은 업데이트된 이미지를 프로덕션 환경에 푸시하는 것만큼 간단합니다.

### 응답성 높은 배포 및 확장 {#responsive-deployment-and-scaling}

Docker의 컨테이너 기반 플랫폼은 매우 휴대성이 높은 워크로드를 제공합니다. Docker 컨테이너는 개발자의 로컬 개발 환경, 데이터 센터의 물리적 또는 가상 머신, 클라우드 제공자 또는 다양한 환경에서 실행할 수 있습니다.

Docker의 휴대성과 가벼운 특성 덕분에 비즈니스 요구에 따라 애플리케이션 및 서비스를 거의 실시간으로 동적으로 관리하고 확장하거나 축소할 수 있습니다.

### 동일한 하드웨어에서 더 많은 워크로드 실행 {#running-more-workloads-on-the-same-hardware}

Docker는 가볍고 빠릅니다. 하이퍼바이저 기반 가상 머신에 대한 비용 효율적인 대안을 제공하므로 서버 용량을 더 많이 사용하여 비즈니스 목표를 달성할 수 있습니다. Docker는 고밀도 환경 및 적은 자원으로 더 많은 작업을 수행해야 하는 소규모 및 중규모 배포에 적합합니다.

## Docker 아키텍처 {#docker-architecture}

Docker는 클라이언트-서버 아키텍처를 사용합니다. Docker 클라이언트는 Docker 데몬과 통신하여 Docker 컨테이너를 빌드, 실행 및 배포하는 작업을 수행합니다. Docker 클라이언트와 데몬은 동일한 시스템에서 실행되거나 원격 Docker 데몬에 연결할 수 있습니다. Docker 클라이언트와 데몬은 UNIX 소켓 또는 네트워크 인터페이스를 통해 REST API를 사용하여 통신합니다. 또 다른 Docker 클라이언트는 Docker Compose로, 여러 컨테이너로 구성된 애플리케이션을 작업할 수 있게 해줍니다.

![Docker Architecture diagram](images/docker-architecture.webp)

### Docker 데몬 {#the-docker-daemon}

Docker 데몬(`dockerd`)은 Docker API 요청을 수신하고 이미지, 컨테이너, 네트워크 및 볼륨과 같은 Docker 객체를 관리합니다. 데몬은 다른 데몬과 통신하여 Docker 서비스를 관리할 수도 있습니다.

### Docker 클라이언트 {#the-docker-client}

Docker 클라이언트(`docker`)는 많은 Docker 사용자가 Docker와 상호 작용하는 주요 방법입니다. `docker run`과 같은 명령을 사용할 때 클라이언트는 이러한 명령을 `dockerd`에 보내고, `dockerd`는 이를 실행합니다. `docker` 명령은 Docker API를 사용합니다. Docker 클라이언트는 여러 데몬과 통신할 수 있습니다.

### Docker Desktop {#docker-desktop}

Docker Desktop은 Mac, Windows 또는 Linux 환경에서 컨테이너화된 애플리케이션 및 마이크로서비스를 빌드하고 공유할 수 있는 간편한 설치 애플리케이션입니다. Docker Desktop에는 Docker 데몬(`dockerd`), Docker 클라이언트(`docker`), Docker Compose, Docker Content Trust, Kubernetes 및 Credential Helper가 포함되어 있습니다. 자세한 내용은 [Docker Desktop](/manuals/데스크탑/_index.md)을 참조하세요.

### Docker 레지스트리 {#docker-registries}

Docker 레지스트리는 Docker 이미지를 저장합니다. Docker Hub는 누구나 사용할 수 있는 공개 레지스트리이며, Docker는 기본적으로 Docker Hub에서 이미지를 찾습니다. 자체 개인 레지스트리를 실행할 수도 있습니다.

`docker pull` 또는 `docker run` 명령을 사용할 때 Docker는 구성된 레지스트리에서 필요한 이미지를 가져옵니다. `docker push` 명령을 사용할 때 Docker는 이미지를 구성된 레지스트리에 푸시합니다.

### Docker 객체 {#docker-objects}

Docker를 사용할 때 이미지, 컨테이너, 네트워크, 볼륨, 플러그인 및 기타 객체를 생성하고 사용합니다. 이 섹션은 이러한 객체 중 일부에 대한 간략한 개요입니다.

#### 이미지 {#images}

이미지는 Docker 컨테이너를 생성하기 위한 지침이 포함된 읽기 전용 템플릿입니다. 종종 이미지는 다른 이미지를 기반으로 하며, 추가적인 커스터마이징이 포함됩니다. 예를 들어, `ubuntu` 이미지를 기반으로 Apache 웹 서버와 애플리케이션을 설치하고 애플리케이션 실행에 필요한 구성 세부 정보를 포함하는 이미지를 빌드할 수 있습니다.

자체 이미지를 생성하거나 다른 사람이 생성하여 레지스트리에 게시한 이미지만 사용할 수도 있습니다. 자체 이미지를 빌드하려면 Dockerfile을 작성하여 이미지를 생성하고 실행하는 데 필요한 단계를 정의하는 간단한 구문을 사용합니다. Dockerfile의 각 명령은 이미지의 레이어를 생성합니다. Dockerfile을 변경하고 이미지를 다시 빌드할 때 변경된 레이어만 다시 빌드됩니다. 이는 다른 가상화 기술과 비교할 때 이미지가 가볍고 작고 빠른 이유 중 하나입니다.

#### 컨테이너 {#containers}

컨테이너는 이미지의 실행 가능한 인스턴스입니다. Docker API 또는 CLI를 사용하여 컨테이너를 생성, 시작, 중지, 이동 또는 삭제할 수 있습니다. 컨테이너를 하나 이상의 네트워크에 연결하거나 스토리지를 연결하거나 현재 상태를 기반으로 새 이미지를 생성할 수도 있습니다.

기본적으로 컨테이너는 다른 컨테이너 및 호스트 머신으로부터 상대적으로 잘 격리되어 있습니다. 컨테이너의 네트워크, 스토리지 또는 기타 기본 하위 시스템이 다른 컨테이너 또는 호스트 머신으로부터 얼마나 격리될지 제어할 수 있습니다.

컨테이너는 이미지와 생성 또는 시작 시 제공하는 구성 옵션에 의해 정의됩니다. 컨테이너가 제거되면 지속 스토리지에 저장되지 않은 상태 변경 사항은 사라집니다.

##### 예시 `docker run` 명령 {#example-docker-run-command}

다음 명령은 `ubuntu` 컨테이너를 실행하고, 로컬 명령줄 세션에 대화형으로 연결하며, `/bin/bash`를 실행합니다.

```bash
$ docker run -i -t ubuntu /bin/bash
```

이 명령을 실행하면 다음의 과정이 발생합니다(기본 레지스트리 구성을 사용하는 경우):

1.  로컬에 `ubuntu` 이미지가 없으면 Docker는 구성된 레지스트리에서 이미지를 가져옵니다. 이는 수동으로 `docker pull ubuntu`를 실행한 것과 같습니다.

2.  Docker는 수동으로 `docker container create` 명령을 실행한 것처럼 새 컨테이너를 생성합니다.

3.  Docker는 컨테이너에 읽기-쓰기 파일 시스템을 할당하여 최종 레이어로 만듭니다. 이를 통해 실행 중인 컨테이너는 로컬 파일 시스템에서 파일 및 디렉터리를 생성하거나 수정할 수 있습니다.

4.  네트워크 옵션을 지정하지 않았기 때문에 Docker는 컨테이너를 기본 네트워크에 연결하기 위한 네트워크 인터페이스를 생성합니다. 여기에는 컨테이너에 IP 주소를 할당하는 것이 포함됩니다. 기본적으로 컨테이너는 호스트 머신의 네트워크 연결을 사용하여 외부 네트워크에 연결할 수 있습니다.

5.  Docker는 컨테이너를 시작하고 `/bin/bash`를 실행합니다. 컨테이너가 대화형으로 실행되고 터미널에 연결되어 있기 때문에(`-i` 및 `-t` 플래그로 인해) 키보드를 사용하여 입력을 제공할 수 있으며 Docker는 출력을 터미널에 기록합니다.

6.  `/bin/bash` 명령을 종료하기 위해 `exit`을 실행하면 컨테이너가 중지되지만 제거되지 않습니다. 다시 시작하거나 제거할 수 있습니다.

## 기본 기술 {#the-underlying-technology}

Docker는 [Go 프로그래밍 언어](https://golang.org/)로 작성되었으며 기능을 제공하기 위해 Linux 커널의 여러 기능을 활용합니다. Docker는 `namespaces`라는 기술을 사용하여 컨테이너라는 격리된 작업 공간을 제공합니다. 컨테이너를 실행할 때 Docker는 해당 컨테이너에 대한 네임스페이스 세트를 생성합니다.

이 네임스페이스는 격리 계층을 제공합니다. 컨테이너의 각 측면은 별도의 네임스페이스에서 실행되며 해당 네임스페이스에 대한 액세스가 제한됩니다.

## 다음 단계 {#next-steps}

- [Docker 설치](/get-started/get-docker.md)
- [Docker 시작하기](/get-started/introduction/_index.md)
