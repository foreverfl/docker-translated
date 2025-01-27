---
title: 내보내기 개요
linkTitle: Exporters
weight: 90
description: 빌드 내보내기는 빌드 결과의 출력 형식을 정의합니다
keywords:
  - 빌드
  - buildx
  - buildkit
  - 내보내기
  - 이미지
  - 레지스트리
  - 로컬
  - tar
  - oci
  - 도커
  - 캐시 전용
aliases:
  - /build/building/exporters/
---

내보내기는 빌드 결과를 지정된 출력 형식으로 저장합니다. 
[`--output` CLI 옵션](/reference/cli/docker/buildx/build.md#output)을 사용하여 사용할 내보내기를 지정합니다.
Buildx는 다음과 같은 내보내기를 지원합니다:

- `image`: 빌드 결과를 컨테이너 이미지로 내보냅니다.
- `registry`: 빌드 결과를 컨테이너 이미지로 내보내고, 지정된 레지스트리에 푸시합니다.
- `local`: 빌드 루트 파일 시스템을 로컬 디렉토리에 내보냅니다.
- `tar`: 빌드 루트 파일 시스템을 로컬 tarball로 압축합니다.
- `oci`: 빌드 결과를 로컬 파일 시스템에 [OCI 이미지 레이아웃](https://github.com/opencontainers/image-spec/blob/v1.0.1/image-layout.md) 형식으로 내보냅니다.
- `docker`: 빌드 결과를 로컬 파일 시스템에 [Docker 이미지 사양 v1.2.0](https://github.com/moby/moby/blob/v25.0.0/image/spec/v1.2.md) 형식으로 내보냅니다.
- `cacheonly`: 빌드 출력을 내보내지 않고 빌드를 실행하고 캐시를 생성합니다.

## 내보내기 사용 {#using-exporters}

내보내기를 지정하려면 다음 명령 구문을 사용하십시오:

```bash
$ docker buildx build --tag <registry>/<image> \
  --output type=<TYPE> .
```

대부분의 일반적인 사용 사례에서는 내보내기를 명시적으로 지정할 필요가 없습니다.
출력을 사용자 정의하거나 디스크에 저장하려는 경우에만 내보내기를 지정해야 합니다.
`--load` 및 `--push` 옵션을 사용하면 Buildx가 사용할 내보내기 설정을 추론할 수 있습니다.

예를 들어, `--tag`와 함께 `--push` 옵션을 사용하면 Buildx는 자동으로 `image` 내보내기를 사용하고,
결과를 지정된 레지스트리에 푸시하도록 내보내기를 구성합니다.

BuildKit이 제공하는 다양한 내보내기의 유연성을 최대한 활용하려면 내보내기 옵션을 구성할 수 있는 `--output` 플래그를 사용하십시오.

## 사용 사례 {#use-cases}

각 내보내기 유형은 다른 사용 사례를 위해 설계되었습니다. 다음 섹션에서는 몇 가지 일반적인 시나리오와 필요한 출력을 생성하기 위해 내보내기를 사용하는 방법을 설명합니다.

### 이미지 저장소로 로드 {#load-to-image-store}

Buildx는 종종 이미지 저장소에 로드할 수 있는 컨테이너 이미지를 빌드하는 데 사용됩니다.
이때 `docker` 내보내기가 사용됩니다. 다음 예제는 `docker` 내보내기를 사용하여 이미지를 빌드하고,
그 이미지를 `--output` 옵션을 사용하여 로컬 이미지 저장소에 로드하는 방법을 보여줍니다:

```bash
$ docker buildx build \
  --output type=docker,name=<registry>/<image> .
```

Buildx CLI는 `--tag` 및 `--load` 옵션을 제공하면 자동으로 `docker` 내보내기를 사용하고 이를 이미지 저장소에 로드합니다:

```bash
$ docker buildx build --tag <registry>/<image> --load .
```

`docker` 드라이버를 사용하여 이미지를 빌드하면 자동으로 로컬 이미지 저장소에 로드됩니다.

이미지 저장소에 로드된 이미지는 빌드가 완료된 직후 `docker run`에 사용할 수 있으며,
`docker images` 명령을 실행하면 이미지 목록에 표시됩니다.

### 레지스트리에 푸시 {#push-to-registry}

빌드된 이미지를 컨테이너 레지스트리에 푸시하려면 `registry` 또는 `image` 내보내기를 사용할 수 있습니다.

Buildx CLI에 `--push` 옵션을 전달하면 BuildKit에 빌드된 이미지를 지정된 레지스트리에 푸시하도록 지시합니다:

```bash
$ docker buildx build --tag <registry>/<image> --push .
```

내부적으로 이는 `image` 내보내기를 사용하고 `push` 매개변수를 설정합니다.
이는 `--output` 옵션을 사용한 다음과 같은 긴 형식의 명령과 동일합니다:

```bash
$ docker buildx build \
  --output type=image,name=<registry>/<image>,push=true .
```

`registry` 내보내기를 사용할 수도 있으며, 이는 동일한 작업을 수행합니다:

```bash
$ docker buildx build \
  --output type=registry,name=<registry>/<image> .
```

### 파일로 이미지 레이아웃 내보내기 {#export-image-layout-to-file}

빌드 결과를 로컬 파일 시스템에 이미지 레이아웃으로 저장하려면 `oci` 또는 `docker` 내보내기를 사용할 수 있습니다.
이 두 내보내기는 모두 해당 이미지 레이아웃을 포함하는 tar 아카이브 파일을 생성합니다.
`dest` 매개변수는 tarball의 대상 출력 경로를 정의합니다.

```bash
$ docker buildx build --output type=oci,dest=./image.tar .
[+] Building 0.8s (7/7) FINISHED
 ...
 => exporting to oci image format                                                                     0.0s
 => exporting layers                                                                                  0.0s
 => exporting manifest sha256:c1ef01a0a0ef94a7064d5cbce408075730410060e253ff8525d1e5f7e27bc900        0.0s
 => exporting config sha256:eadab326c1866dd247efb52cb715ba742bd0f05b6a205439f107cf91b3abc853          0.0s
 => sending tarball                                                                                   0.0s
$ mkdir -p out && tar -C out -xf ./image.tar
$ tree out
out
├── blobs
│   └── sha256
│       ├── 9b18e9b68314027565b90ff6189d65942c0f7986da80df008b8431276885218e
│       ├── c78795f3c329dbbbfb14d0d32288dea25c3cd12f31bd0213be694332a70c7f13
│       ├── d1cf38078fa218d15715e2afcf71588ee482352d697532cf316626164699a0e2
│       ├── e84fa1df52d2abdfac52165755d5d1c7621d74eda8e12881f6b0d38a36e01775
│       └── fe9e23793a27fe30374308988283d40047628c73f91f577432a0d05ab0160de7
├── index.json
├── manifest.json
└── oci-layout
```

### 파일 시스템 내보내기 {#export-filesystem}

빌드 결과에서 이미지를 빌드하지 않고 파일 시스템을 내보내려면 `local` 및 `tar` 내보내기를 사용할 수 있습니다.

`local` 내보내기는 파일 시스템을 지정된 위치의 디렉토리 구조로 압축 해제합니다.
`tar` 내보내기는 tarball 아카이브 파일을 생성합니다.

```bash
$ docker buildx build --output type=local,dest=<path/to/output> .
```

`local` 내보내기는 [다단계 빌드](../building/multi-stage.md)에서 유용합니다.
최소한의 빌드 아티팩트(예: 자체 포함된 바이너리)만 내보낼 수 있기 때문입니다.

### 캐시 전용 내보내기 {#cache-only-export}

`cacheonly` 내보내기는 빌드 출력을 내보내지 않고 빌드를 실행하려는 경우에 사용할 수 있습니다.
예를 들어, 테스트 빌드를 실행하려는 경우 유용할 수 있습니다.
또는 빌드를 먼저 실행하고 후속 명령을 사용하여 내보내기를 생성하려는 경우 유용할 수 있습니다.
`cacheonly` 내보내기는 빌드 캐시를 생성하므로 후속 빌드는 즉시 완료됩니다.

```bash
$ docker buildx build --output type=cacheonly
```

내보내기를 지정하지 않고 `--load`와 같은 적절한 내보내기를 자동으로 선택하는 단축 옵션을 제공하지 않으면 Buildx는 기본적으로 `cacheonly` 내보내기를 사용합니다.
단, `docker` 드라이버를 사용하여 빌드하는 경우 `docker` 내보내기를 사용합니다.

Buildx는 기본값으로 `cacheonly`를 사용할 때 경고 메시지를 기록합니다:

```bash
$ docker buildx build .
WARNING: No output specified with docker-container driver.
         Build result will only remain in the build cache.
         To push result image into registry use --push or
         to load image into docker use --load
```

## 여러 내보내기 {#multiple-exporters}

`--output` 플래그를 여러 번 지정하여 주어진 빌드에 대해 여러 내보내기를 사용할 수 있습니다.
이 기능은 **Buildx 및 BuildKit** 버전 0.13.0 이상이 필요합니다.

다음 예제는 세 가지 다른 내보내기를 사용하여 단일 빌드를 실행합니다:

- `registry` 내보내기를 사용하여 이미지를 레지스트리에 푸시합니다.
- `local` 내보내기를 사용하여 빌드 결과를 로컬 파일 시스템에 추출합니다.
- 결과를 로컬 이미지 저장소에 로드하기 위한 단축키인 `--load` 플래그(이미지 내보내기)를 사용합니다.

```bash
$ docker buildx build \
  --output type=registry,tag=<registry>/<image> \
  --output type=local,dest=<path/to/output> \
  --load .
```

## 구성 옵션 {#configuration-options}

이 섹션에서는 내보내기에 사용할 수 있는 몇 가지 구성 옵션을 설명합니다.

여기에서 설명하는 옵션은 두 개 이상의 내보내기 유형에 공통적입니다.
또한, 다양한 내보내기 유형은 특정 매개변수를 지원합니다.
각 내보내기에 대한 자세한 페이지를 참조하여 어떤 구성 매개변수가 적용되는지 확인하십시오.

여기에서 설명하는 공통 매개변수는 다음과 같습니다:

- [압축](#compression)
- [OCI 미디어 유형](#oci-media-types)

### 압축 {#compression}

압축된 출력을 내보낼 때 사용할 정확한 압축 알고리즘과 수준을 구성할 수 있습니다.
기본값은 좋은 기본 경험을 제공하지만, 저장 공간 대 컴퓨팅 비용을 최적화하기 위해 매개변수를 조정할 수 있습니다.
압축 매개변수를 변경하면 필요한 저장 공간을 줄이고 이미지 다운로드 시간을 개선할 수 있지만, 빌드 시간이 증가합니다.

압축 알고리즘을 선택하려면 `compression` 옵션을 사용할 수 있습니다.
예를 들어, `compression=zstd`로 `image`를 빌드하려면:

```bash
$ docker buildx build \
  --output type=image,name=<registry>/<image>,push=true,compression=zstd .
```

`compression` 매개변수와 함께 `compression-level=<value>` 옵션을 사용하여 지원되는 알고리즘의 압축 수준을 선택하십시오:

- `gzip` 및 `estargz`의 경우 0-9
- `zstd`의 경우 0-22

일반적으로 숫자가 높을수록 결과 파일이 작아지고 압축 시간이 길어집니다.

`force-compression=true` 옵션을 사용하여 이전 이미지에서 가져온 레이어를 다시 압축하도록 강제할 수 있습니다.
요청된 압축 알고리즘이 이전 압축 알고리즘과 다른 경우에 유용합니다.

:::note
`gzip` 및 `estargz` 압축 방법은 [`compress/gzip` 패키지](https://pkg.go.dev/compress/gzip)를 사용하고,
`zstd`는 [`github.com/klauspost/compress/zstd` 패키지](https://github.com/klauspost/compress/tree/master/zstd)를 사용합니다.
:::

### OCI 미디어 유형 {#oci-media-types}

`image`, `registry`, `oci` 및 `docker` 내보내기는 컨테이너 이미지를 생성합니다.
이 내보내기는 Docker 미디어 유형(기본값)과 OCI 미디어 유형을 모두 지원합니다.

OCI 미디어 유형이 설정된 이미지를 내보내려면 `oci-mediatypes` 속성을 사용하십시오.

```bash
$ docker buildx build \
  --output type=image,name=<registry>/<image>,push=true,oci-mediatypes=true .
```

## 다음 단계 {#whats-next}

각 내보내기에 대해 자세히 읽고 작동 방식과 사용 방법을 알아보십시오:

- [이미지 및 레지스트리 내보내기](image-registry.md)
- [OCI 및 Docker 내보내기](oci-docker.md).
- [로컬 및 tar 내보내기](local-tar.md)
