---
title: 사용자 정의 Dockerfile 구문
description: Dockerfile 프론트엔드에 대해 깊이 알아보고, 사용자 정의 프론트엔드에 대해 배워보세요
keywords:
  - 빌드
  - 빌드킷
  - 도커파일
  - 프론트엔드
aliases:
  - /build/buildkit/dockerfile-frontend/
  - /build/dockerfile/frontend/
---

## Dockerfile 프론트엔드 {#dockerfile-frontend}

BuildKit은 컨테이너 이미지에서 프론트엔드를 동적으로 로드하는 것을 지원합니다. 외부 Dockerfile 프론트엔드를 사용하려면, [Dockerfile](/reference/dockerfile.md)의 첫 번째 줄에 특정 이미지를 가리키는 [`syntax` 지시어](/reference/dockerfile.md#syntax)를 설정해야 합니다:

```dockerfile
# syntax=[remote image reference]
```

예를 들어:

```dockerfile
# syntax=docker/dockerfile:1
# syntax=docker.io/docker/dockerfile:1
# syntax=example.com/user/repo:tag@sha256:abcdef...
```

명령줄에서 프론트엔드 이미지 참조를 설정하기 위해 미리 정의된 `BUILDKIT_SYNTAX` 빌드 인수를 사용할 수도 있습니다:

```bash
$ docker build --build-arg BUILDKIT_SYNTAX=docker/dockerfile:1 .
```

이것은 Dockerfile을 빌드하는 데 사용되는 Dockerfile 구문의 위치를 정의합니다. BuildKit 백엔드는 Docker 이미지를 통해 배포되고 컨테이너 샌드박스 환경 내에서 실행되는 외부 구현을 원활하게 사용할 수 있게 합니다.

사용자 정의 Dockerfile 구현을 통해 다음을 할 수 있습니다:

- Docker 데몬을 업데이트하지 않고 자동으로 버그 수정 받기
- 모든 사용자가 동일한 구현을 사용하여 Dockerfile을 빌드하도록 보장
- Docker 데몬을 업데이트하지 않고 최신 기능 사용
- Docker 데몬에 통합되기 전에 새로운 기능이나 타사 기능을 시도해보기
- [대체 빌드 정의 사용 또는 직접 생성](https://github.com/moby/buildkit#exploring-llb)
- 사용자 정의 기능이 포함된 Dockerfile 프론트엔드 빌드

:::note
BuildKit에는 내장된 Dockerfile 프론트엔드가 포함되어 있지만, 모든 사용자가 빌더에서 동일한 버전을 사용하고 새로운 BuildKit 또는 Docker Engine 버전을 기다리지 않고 자동으로 버그 수정을 받도록 외부 이미지를 사용하는 것이 좋습니다.
:::

## 공식 릴리스 {#official-releases}

Docker는 Docker Hub의 `docker/dockerfile` 리포지토리에서 Dockerfile을 빌드하는 데 사용할 수 있는 공식 버전의 이미지를 배포합니다. 새로운 이미지는 `stable`과 `labs` 두 채널에서 릴리스됩니다.

### 안정 채널 {#stable-channel}

`stable` 채널은 [시맨틱 버전 관리](https://semver.org)를 따릅니다.
예를 들어:

- `docker/dockerfile:1` - 최신 `1.x.x` 마이너 및 패치 릴리스로 업데이트됨.
- `docker/dockerfile:1.2` - 최신 `1.2.x` 패치 릴리스로 업데이트되며, 버전 `1.3.0`이 릴리스되면 업데이트 중단.
- `docker/dockerfile:1.2.1` - 불변: 절대 업데이트되지 않음.

버전 1 구문의 최신 안정 릴리스를 항상 가리키고, 버전 1 릴리스 주기 동안 "마이너" 및 "패치" 업데이트를 받는 `docker/dockerfile:1`을 사용하는 것이 좋습니다. BuildKit은 빌드를 수행할 때 구문의 업데이트를 자동으로 확인하여 가장 최신 버전을 사용하고 있는지 확인합니다.

특정 버전(예: `1.2` 또는 `1.2.1`)을 사용하는 경우, Dockerfile을 계속해서 버그 수정 및 새로운 기능을 받기 위해 수동으로 업데이트해야 합니다. Dockerfile의 이전 버전은 빌더의 새 버전과 호환됩니다.

### 실험실 채널 {#labs-channel}

`labs` 채널은 `stable` 채널에서 아직 사용할 수 없는 Dockerfile 기능에 대한 조기 액세스를 제공합니다. `labs` 이미지는 안정 릴리스와 동시에 릴리스되며, 동일한 버전 패턴을 따르지만 `-labs` 접미사를 사용합니다. 예를 들어:

- `docker/dockerfile:labs` - `labs` 채널의 최신 릴리스.
- `docker/dockerfile:1-labs` - 실험적 기능이 활성화된 `dockerfile:1`과 동일.
- `docker/dockerfile:1.2-labs` - 실험적 기능이 활성화된 `dockerfile:1.2`와 동일.
- `docker/dockerfile:1.2.1-labs` - 불변: 절대 업데이트되지 않음. 실험적 기능이 활성화된 `dockerfile:1.2.1`과 동일.

필요에 가장 적합한 채널을 선택하세요. 새로운 기능을 활용하고 싶다면 `labs` 채널을 사용하세요. `labs` 채널의 이미지는 `stable` 채널의 모든 기능과 조기 액세스 기능을 포함합니다. `labs` 채널의 안정 기능은 [시맨틱 버전 관리](https://semver.org)를 따르지만, 조기 액세스 기능은 따르지 않으며, 새로운 릴리스는 이전 버전과 호환되지 않을 수 있습니다. 버전을 고정하여 호환성 문제를 피하세요.

## 기타 리소스 {#other-resources}

`labs` 기능, 마스터 빌드 및 야간 기능 릴리스에 대한 문서는 [GitHub의 BuildKit 소스 리포지토리](https://github.com/moby/buildkit/blob/master/README.md) 설명을 참조하세요. 사용 가능한 이미지의 전체 목록은 [`docker/dockerfile` 리포지토리](https://hub.docker.com/r/docker/dockerfile)와 개발 빌드를 위한 [`docker/dockerfile-upstream` 리포지토리](https://hub.docker.com/r/docker/dockerfile-upstream)를 방문하세요.
