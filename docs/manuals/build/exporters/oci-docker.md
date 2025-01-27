---
title: OCI 및 Docker Exportor
keywords:
  - 빌드
  - buildx
  - buildkit
  - Exportor
  - oci
  - docker
description: >
  OCI 및 Docker Exportor는 로컬 파일 시스템에 이미지 레이아웃 tarball을 생성합니다.
aliases:
  - /build/building/exporters/oci-docker/
---

`oci` Exportor는 빌드 결과를 [OCI 이미지 레이아웃](https://github.com/opencontainers/image-spec/blob/main/image-layout.md) tarball로 출력합니다. `docker` Exportor도 동일하게 동작하지만 Docker 이미지 레이아웃을 내보냅니다.

[`docker` 드라이버](/manuals/build/builders/drivers/docker.md)는 이러한 Exportor를 지원하지 않습니다. 이러한 출력을 생성하려면 `docker-container` 또는 다른 드라이버를 사용해야 합니다.

## 개요 {#synopsis}

`oci` 및 `docker` Exportor를 사용하여 컨테이너 이미지를 빌드합니다:

```bash
$ docker buildx build --output type=oci[,parameters] .
```

```bash
$ docker buildx build --output type=docker[,parameters] .
```

다음 표는 사용 가능한 매개변수를 설명합니다:

| 매개변수            | 유형                                   | 기본값  | 설명                                                                                                                                  |
| ------------------- | -------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | 문자열                                 |         | 이미지 이름 지정                                                                                                                      |
| `dest`              | 문자열                                 |         | 경로                                                                                                                                  |
| `tar`               | `true`,`false`                         | `true`  | 출력을 tarball 레이아웃으로 번들링                                                                                                    |
| `compression`       | `uncompressed`,`gzip`,`estargz`,`zstd` | `gzip`  | 압축 유형, [compression][1] 참조                                                                                                      |
| `compression-level` | `0..22`                                |         | 압축 수준, [compression][1] 참조                                                                                                      |
| `force-compression` | `true`,`false`                         | `false` | 강제로 압축 적용, [compression][1] 참조                                                                                               |
| `oci-mediatypes`    | `true`,`false`                         |         | Exportor 매니페스트에 OCI 미디어 유형 사용. `type=oci`의 기본값은 `true`, `type=docker`의 기본값은 `false`. [OCI Media types][2] 참조 |
| `annotation.<key>`  | 문자열                                 |         | 빌드된 이미지에 해당 `key`와 `value`를 가진 주석을 첨부, [annotations][3] 참조                                                        |

[1]: _index.md#compression
[2]: _index.md#oci-media-types
[3]: #annotations

## 주석 {#annotations}

이 Exportor는 `annotation` 매개변수를 사용하여 OCI 주석을 추가하는 것을 지원합니다. 점 표기법을 사용하여 주석 이름을 지정합니다. 다음 예제는 `org.opencontainers.image.title` 주석을 설정합니다:

```bash
$ docker buildx build \
    --output "type=<type>,name=<registry>/<image>,annotation.org.opencontainers.image.title=<title>" .
```

주석에 대한 자세한 내용은 [BuildKit 문서](https://github.com/moby/buildkit/blob/master/docs/annotations.md)를 참조하십시오.

## 추가 읽기 {#further-reading}

`oci` 또는 `docker` Exportor에 대한 자세한 내용은 [BuildKit README](https://github.com/moby/buildkit/blob/master/README.md#docker-tarball)를 참조하십시오.
