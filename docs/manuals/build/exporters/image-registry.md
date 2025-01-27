---
title: 이미지 및 레지스트리 내보내기
description: |
  이미지 및 레지스트리 내보내기는 로컬 이미지 저장소에 로드하거나 레지스트리에 푸시할 수 있는 이미지를 생성합니다.
keywords:
  - 빌드
  - buildx
  - buildkit
  - 내보내기
  - 이미지
  - 레지스트리
aliases:
  - /build/building/exporters/image-registry/
---

`image` 내보내기는 빌드 결과를 컨테이너 이미지 형식으로 출력합니다. `registry` 내보내기는 동일하지만 `push=true`를 설정하여 결과를 자동으로 푸시합니다.

## 개요 {#synopsis}

`image` 및 `registry` 내보내기를 사용하여 컨테이너 이미지를 빌드합니다:

```bash
$ docker buildx build --output type=image[,parameters] .
$ docker buildx build --output type=registry[,parameters] .
```

다음 표는 `type=image`에 대해 `--output`에 전달할 수 있는 사용 가능한 매개변수를 설명합니다:

| 매개변수                | 유형                                    | 기본값  | 설명                                                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                 | 문자열                                  |         | 이미지 이름 지정                                                                                                                                                                                                                     |
| `push`                 | `true`,`false`                         | `false` | 이미지 생성 후 푸시                                                                                                                                                                                                                   |
| `push-by-digest`       | `true`,`false`                         | `false` | 이름 없이 이미지 푸시                                                                                                                                                                                                                |
| `registry.insecure`    | `true`,`false`                         | `false` | 안전하지 않은 레지스트리에 푸시 허용                                                                                                                                                                                                 |
| `dangling-name-prefix` | `<value>`                              |         | `prefix@<digest>`로 이미지 이름 지정, 익명 이미지에 사용                                                                                                                                                                              |
| `name-canonical`       | `true`,`false`                         |         | 추가적인 정식 이름 `name@<digest>` 추가                                                                                                                                                                                              |
| `compression`          | `uncompressed`,`gzip`,`estargz`,`zstd` | `gzip`  | 압축 유형, [compression][1] 참조                                                                                                                                                                                                     |
| `compression-level`    | `0..22`                                |         | 압축 수준, [compression][1] 참조                                                                                                                                                                                                     |
| `force-compression`    | `true`,`false`                         | `false` | 강제 압축 적용, [compression][1] 참조                                                                                                                                                                                                |
| `rewrite-timestamp`    | `true`,`false`                         | `false` | 파일 타임스탬프를 `SOURCE_DATE_EPOCH` 값으로 다시 작성. `SOURCE_DATE_EPOCH` 값을 지정하는 방법은 [build reproducibility][4] 참조.                                                                                                     |
| `oci-mediatypes`       | `true`,`false`                         | `false` | 내보내기 매니페스트에 OCI 미디어 유형 사용, [OCI Media types][2] 참조                                                                                                                                                                |
| `unpack`               | `true`,`false`                         | `false` | 생성 후 이미지 풀기 (containerd와 함께 사용)                                                                                                                                                                                          |
| `store`                | `true`,`false`                         | `true`  | 결과 이미지를 작업자의 (예: containerd) 이미지 저장소에 저장하고, 이미지가 콘텐츠 저장소에 모든 블롭을 포함하도록 보장. 작업자가 이미지 저장소가 없는 경우 (예: OCI 작업자 사용 시) 무시됨.                                             |
| `annotation.<key>`     | 문자열                                  |         | 해당 `key` 및 `value`로 빌드된 이미지에 주석 첨부, [annotations][3] 참조                                                                                                                                                             |

[1]: _index.md#compression
[2]: _index.md#oci-media-types
[3]: #annotations
[4]: https://github.com/moby/buildkit/blob/master/docs/build-repro.md

## 주석 {#annotations}

이 내보내기는 `annotation` 매개변수를 사용하여 OCI 주석 추가를 지원하며, 점 표기법을 사용하여 주석 이름을 지정합니다. 다음 예제는 `org.opencontainers.image.title` 주석을 설정합니다:

```bash
$ docker buildx build \
    --output "type=<type>,name=<registry>/<image>,annotation.org.opencontainers.image.title=<title>" .
```

주석에 대한 자세한 내용은 [BuildKit 문서](https://github.com/moby/buildkit/blob/master/docs/annotations.md)를 참조하십시오.

## 추가 자료 {#further-reading}

`image` 또는 `registry` 내보내기에 대한 자세한 내용은 [BuildKit README](https://github.com/moby/buildkit/blob/master/README.md#imageregistry)를 참조하십시오.
