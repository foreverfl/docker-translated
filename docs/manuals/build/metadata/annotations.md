---
title: 주석
description: 주석은 OCI 이미지에 대한 추가 메타데이터를 지정합니다
keywords:
  - 빌드
  - 빌드킷
  - 주석
  - 메타데이터
aliases:
  - /build/building/annotations/
---

주석은 이미지에 대한 설명 메타데이터를 제공합니다. 주석을 사용하여 임의의 정보를 기록하고 이미지를 소비하는 사람들과 도구가 이미지의 출처, 내용 및 사용 방법을 이해할 수 있도록 도와줍니다.

주석은 [레이블](/engine/manage-resources/labels)과 유사하며, 어떤 면에서는 겹칩니다. 둘 다 리소스에 메타데이터를 첨부하는 목적을 가지고 있습니다. 일반적인 원칙으로, 주석과 레이블의 차이를 다음과 같이 생각할 수 있습니다:

- 주석은 [매니페스트](https://github.com/opencontainers/image-spec/blob/main/manifest.md), [인덱스](https://github.com/opencontainers/image-spec/blob/main/image-index.md), [디스크립터](https://github.com/opencontainers/image-spec/blob/main/descriptor.md)와 같은 OCI 이미지 구성 요소를 설명합니다.
- 레이블은 이미지, 컨테이너, 네트워크 및 볼륨과 같은 Docker 리소스를 설명합니다.

OCI 이미지 [사양](https://github.com/opencontainers/image-spec/blob/main/annotations.md)은 주석의 형식과 사전 정의된 주석 키 세트를 정의합니다. 지정된 표준을 준수하면 Docker Scout와 같은 도구를 통해 이미지에 대한 메타데이터를 자동적이고 일관되게 표시할 수 있습니다.

주석은 [증명](/build/metadata/attestations/)과 혼동해서는 안 됩니다:

- 증명은 이미지가 어떻게 빌드되었고 무엇을 포함하는지에 대한 정보를 포함합니다.
  증명은 이미지 인덱스에 별도의 매니페스트로 첨부됩니다.
  증명은 Open Container Initiative에 의해 표준화되지 않았습니다.
- 주석은 이미지에 대한 임의의 메타데이터를 포함합니다.
  주석은 이미지 [구성](https://github.com/opencontainers/image-spec/blob/main/config.md)에 레이블로 첨부되거나, 이미지 인덱스 또는 매니페스트에 속성으로 첨부됩니다.

## 주석 추가 {#add-annotations}

이미지를 빌드할 때, 또는 이미지 매니페스트나 인덱스를 생성할 때 주석을 추가할 수 있습니다.

:::note
Docker Engine 이미지 저장소는 주석이 있는 이미지를 로드하는 것을 지원하지 않습니다. 주석을 사용하여 빌드하려면 `--push` CLI 플래그 또는 [레지스트리 익스포터](/manuals/build/exporters/image-registry.md)를 사용하여 이미지를 직접 레지스트리에 푸시해야 합니다.
:::

명령줄에서 주석을 지정하려면 `docker build` 명령에 `--annotation` 플래그를 사용하십시오:

```bash
$ docker build --push --annotation "foo=bar" .
```

[Bake](/manuals/build/bake/_index.md)를 사용하는 경우, `annotations` 속성을 사용하여 특정 대상에 대한 주석을 지정할 수 있습니다:

```hcl
target "default" {
  output = ["type=registry"]
  annotations = ["foo=bar"]
}
```

GitHub Actions를 사용하여 빌드된 이미지에 주석을 추가하는 예제는 [GitHub Actions로 이미지 주석 추가](/manuals/build/ci/github-actions/annotations.md)를 참조하십시오.

`docker buildx imagetools create`를 사용하여 생성된 이미지에 주석을 추가할 수도 있습니다. 이 명령은 인덱스 또는 매니페스트 디스크립터에 주석을 추가하는 것만 지원합니다. 자세한 내용은 [CLI 참조](/reference/cli/docker/buildx/imagetools/create.md#annotations)를 참조하십시오.

## 주석 검사 {#inspect-annotations}

**이미지 인덱스**의 주석을 보려면 `docker buildx imagetools inspect` 명령을 사용하십시오. 이 명령은 인덱스와 인덱스가 포함하는 디스크립터(매니페스트 참조)에 대한 주석을 보여줍니다. 다음 예제는 디스크립터에 `org.opencontainers.image.documentation` 주석이 있고, 인덱스에 `org.opencontainers.image.authors` 주석이 있는 것을 보여줍니다.

```bash {hl_lines=["10-12","19-21"]}
// 주석을 포함한 예제 출력
$ docker buildx imagetools inspect <IMAGE> --raw
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.index.v1+json",
  "manifests": [
    {
      "mediaType": "application/vnd.oci.image.manifest.v1+json",
      "digest": "sha256:d20246ef744b1d05a1dd69d0b3fa907db007c07f79fe3e68c17223439be9fefb",
      "size": 911,
      "annotations": {
        "org.opencontainers.image.documentation": "https://foo.example/docs",
      },
      "platform": {
        "architecture": "amd64",
        "os": "linux"
      }
    },
  ],
  "annotations": {
    "org.opencontainers.image.authors": "dvdksn"
  }
}
```

매니페스트의 주석을 검사하려면 `docker buildx imagetools inspect` 명령을 사용하고 `<IMAGE>@<DIGEST>`를 지정하십시오. 여기서 `<DIGEST>`는 매니페스트의 다이제스트입니다:

```bash {hl_lines="22-25"}
// 주석을 포함한 예제 출력
$ docker buildx imagetools inspect <IMAGE>@sha256:d20246ef744b1d05a1dd69d0b3fa907db007c07f79fe3e68c17223439be9fefb --raw
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config": {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "digest": "sha256:4368b6959a78b412efa083c5506c4887e251f1484ccc9f0af5c406d8f76ece1d",
    "size": 850
  },
  "layers": [
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:2c03dbb20264f09924f9eab176da44e5421e74a78b09531d3c63448a7baa7c59",
      "size": 3333033
    },
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:4923ad480d60a548e9b334ca492fa547a3ce8879676685b6718b085de5aaf142",
      "size": 61887305
    }
  ],
  "annotations": {
    "index,manifest:org.opencontainers.image.vendor": "foocorp",
    "org.opencontainers.image.source": "https://git.example/foo.git",
  }
}
```

## 주석 수준 지정 {#specify-annotation-level}

기본적으로 주석은 이미지 매니페스트에 추가됩니다. 주석 문자열에 특수 유형 선언을 접두사로 붙여 주석을 첨부할 수준(OCI 이미지 구성 요소)을 지정할 수 있습니다:

```bash
$ docker build --annotation "<TYPE>:<KEY>=<VALUE>" .
```

다음 유형이 지원됩니다:

- `manifest`: 매니페스트에 주석을 추가합니다.
- `index`: 루트 인덱스에 주석을 추가합니다.
- `manifest-descriptor`: 인덱스의 매니페스트 디스크립터에 주석을 추가합니다.
- `index-descriptor`: 이미지 레이아웃의 인덱스 디스크립터에 주석을 추가합니다.

예를 들어, 이미지 인덱스에 `foo=bar` 주석을 첨부하여 이미지를 빌드하려면:

```bash
$ docker build --tag <IMAGE> --push --annotation "index:foo=bar" .
```

빌드가 지정한 구성 요소를 생성해야 하며, 그렇지 않으면 빌드가 실패합니다. 예를 들어, 다음은 작동하지 않습니다. `docker` 익스포터는 인덱스를 생성하지 않기 때문입니다:

```bash
$ docker build --output type=docker --annotation "index:foo=bar" .
```

마찬가지로, 다음 예제도 작동하지 않습니다. 빌드x는 일부 상황에서 기본적으로 `docker` 출력을 생성하기 때문입니다. 예를 들어, 증명 증명이 명시적으로 비활성화된 경우:

```bash
$ docker build --provenance=false --annotation "index:foo=bar" .
```

쉼표로 구분된 유형을 지정하여 주석을 여러 수준에 추가할 수 있습니다. 다음 예제는 이미지 인덱스와 이미지 매니페스트 모두에 `foo=bar` 주석을 추가합니다:

```bash
$ docker build --tag <IMAGE> --push --annotation "index,manifest:foo=bar" .
```

특정 OS 및 아키텍처와 일치하는 구성 요소에만 주석을 추가하려면 유형 접두사에 대괄호 안에 플랫폼 한정자를 지정할 수도 있습니다. 다음 예제는 `linux/amd64` 매니페스트에만 `foo=bar` 주석을 추가합니다:

```bash
$ docker build --tag <IMAGE> --push --annotation "manifest[linux/amd64]:foo=bar" .
```

## 관련 정보 {#related-information}

관련 기사:

- [GitHub Actions로 이미지 주석 추가](/manuals/build/ci/github-actions/annotations.md)
- [주석 OCI 사양][specification]

참조 정보:

- [`docker buildx build --annotation`](/reference/cli/docker/buildx/build.md#annotation)
- [Bake 파일 참조: `annotations`](/manuals/build/bake/reference.md#targetannotations)
- [`docker buildx imagetools create --annotation`](/reference/cli/docker/buildx/imagetools/create.md#annotation)

<!-- links -->

[specification]: https://github.com/opencontainers/image-spec/blob/main/annotations.md
[attestations]: /manuals/build/metadata/attestations/_index.md
[config]: https://github.com/opencontainers/image-spec/blob/main/config.md
[descriptors]: https://github.com/opencontainers/image-spec/blob/main/descriptor.md
[indexes]: https://github.com/opencontainers/image-spec/blob/main/image-index.md
[labels]: /manuals/engine/manage-resources/labels.md
[manifests]: https://github.com/opencontainers/image-spec/blob/main/manifest.md
