---
title: 도커 빌드 개요
weight: 10
description: Docker Build 및 구성 요소에 대해 알아보세요.
keywords:
  - 빌드
  - 빌드킷
  - 빌드엑스
  - 아키텍처
aliases:
- /build/install-buildx/
- /build/architecture/
---

Docker Build는 클라이언트-서버 아키텍처를 구현합니다. 여기서:

- 클라이언트: Buildx는 빌드를 실행하고 관리하기 위한 사용자 인터페이스인 클라이언트입니다.
- 서버: BuildKit은 빌드 실행을 처리하는 서버 또는 빌더입니다.

빌드를 호출하면 Buildx 클라이언트가 BuildKit 백엔드에 빌드 요청을 보냅니다. BuildKit은 빌드 지침을 해결하고 빌드 단계를 실행합니다. 빌드 출력은 클라이언트로 다시 전송되거나 Docker Hub와 같은 레지스트리에 업로드됩니다.

Buildx와 BuildKit은 Docker Desktop 및 Docker Engine에 기본적으로 설치되어 있습니다. `docker build` 명령을 호출하면 기본적으로 Docker에 번들로 포함된 BuildKit을 사용하여 빌드를 실행하는 Buildx를 사용하게 됩니다.

## Buildx {#buildx}

Buildx는 빌드를 실행하는 데 사용하는 CLI 도구입니다. `docker build` 명령은 Buildx를 감싸는 래퍼입니다. `docker build`를 호출하면 Buildx는 빌드 옵션을 해석하고 BuildKit 백엔드에 빌드 요청을 보냅니다.

Buildx 클라이언트는 빌드를 실행하는 것 이상을 할 수 있습니다. Buildx를 사용하여 빌더라고 하는 BuildKit 백엔드를 생성하고 관리할 수도 있습니다. 또한 레지스트리에서 이미지를 관리하고 여러 빌드를 동시에 실행하는 기능도 지원합니다.

Docker Buildx는 Docker Desktop에 기본적으로 설치되어 있습니다. 또한 소스에서 CLI 플러그인을 빌드하거나 GitHub 리포지토리에서 바이너리를 다운로드하여 수동으로 설치할 수 있습니다. 자세한 내용은 GitHub의 [Buildx README](https://github.com/docker/buildx#manual-download)를 참조하세요.

:::note
`docker build`는 내부적으로 Buildx를 호출하지만, 이 명령과 정식 `docker buildx build` 사이에는 미묘한 차이가 있습니다. 자세한 내용은 [Difference between `docker build` and `docker buildx build`](../builders/_index.md#difference-between-docker-build-and-docker-buildx-build)를 참조하세요.
:::

## BuildKit {#buildkit}

BuildKit은 빌드 작업을 실행하는 데몬 프로세스입니다.

빌드 실행은 `docker build` 명령 호출로 시작됩니다. Buildx는 빌드 명령을 해석하고 BuildKit 백엔드에 빌드 요청을 보냅니다. 빌드 요청에는 다음이 포함됩니다:

- Dockerfile
- 빌드 인수
- 내보내기 옵션
- 캐싱 옵션

BuildKit은 빌드 지침을 해결하고 빌드 단계를 실행합니다. BuildKit이 빌드를 실행하는 동안 Buildx는 빌드 상태를 모니터링하고 진행 상황을 터미널에 출력합니다.

빌드에 클라이언트의 리소스(예: 로컬 파일 또는 보안 정보)가 필요한 경우 BuildKit은 필요한 리소스를 Buildx에서 요청합니다.

이것이 이전 버전의 Docker에서 사용된 레거시 빌더와 비교하여 BuildKit이 더 효율적인 한 가지 방법입니다. BuildKit은 빌드에 필요한 리소스만 필요할 때 요청합니다. 반면 레거시 빌더는 항상 로컬 파일 시스템의 복사본을 가져옵니다.

BuildKit이 Buildx에서 요청할 수 있는 리소스의 예는 다음과 같습니다:

- 로컬 파일 시스템 빌드 컨텍스트
- 보안 키나 비밀번호 등 민감한 빌드 정보
- SSH 소켓
- 레지스트리 인증 토큰

BuildKit에 대한 자세한 내용은 [BuildKit](/manuals/build/buildkit/_index.md)를 참조하세요.
