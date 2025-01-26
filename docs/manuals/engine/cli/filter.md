---
title: 필터 명령어
weight: 30
description: |
  CLI에서 필터링 기능을 사용하여 정의한 패턴과 일치하는 리소스를 선택적으로 포함합니다.
keywords:
  - cli
  - 필터
  - 명령어
  - 출력
  - 포함
  - 제외
aliases:
  - /config/filter/
---

`--filter` 플래그를 사용하면 명령어의 범위를 지정할 수 있습니다. 필터링 시 지정한 패턴과 일치하는 항목만 포함됩니다.

## 필터 사용하기 {#using-filters}

`--filter` 플래그는 연산자로 구분된 키-값 쌍을 기대합니다.

```console
$ docker COMMAND --filter "KEY=VALUE"
```

키는 필터링하려는 필드를 나타냅니다.
값은 지정된 필드가 일치해야 하는 패턴입니다.
연산자는 등호(`=`) 또는 부등호(`!=`)일 수 있습니다.

예를 들어, `docker images --filter reference=alpine` 명령어는
`docker images` 명령어의 출력을 `alpine` 이미지로만 필터링합니다.

```console
$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
ubuntu       20.04     33a5cc25d22c   36 minutes ago   101MB
ubuntu       18.04     152dc042452c   36 minutes ago   88.1MB
alpine       3.16      a8cbb8c69ee7   40 minutes ago   8.67MB
alpine       latest    7144f7bab3d4   40 minutes ago   11.7MB
busybox      uclibc    3e516f71d880   48 minutes ago   2.4MB
busybox      glibc     7338d0c72c65   48 minutes ago   6.09MB
$ docker images --filter reference=alpine
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
alpine       3.16      a8cbb8c69ee7   40 minutes ago   8.67MB
alpine       latest    7144f7bab3d4   40 minutes ago   11.7MB
```

사용 가능한 필드(`reference`의 경우)는 실행하는 명령어에 따라 다릅니다.
일부 필터는 정확한 일치를 기대합니다. 다른 필터는 부분 일치를 처리합니다. 일부 필터는 정규 표현식을 사용할 수 있습니다.

각 명령어에 대한 지원되는 필터링 기능을 알아보려면 [CLI 참조 설명](#reference)을 참조하십시오.

## 필터 결합하기 {#combining-filters}

여러 `--filter` 플래그를 전달하여 여러 필터를 결합할 수 있습니다. 다음 예제는 논리적 `OR`를 사용하여 `alpine:latest` 또는 `busybox`와 일치하는 모든 이미지를 출력하는 방법을 보여줍니다.

```console
$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
ubuntu       20.04     33a5cc25d22c   2 hours ago   101MB
ubuntu       18.04     152dc042452c   2 hours ago   88.1MB
alpine       3.16      a8cbb8c69ee7   2 hours ago   8.67MB
alpine       latest    7144f7bab3d4   2 hours ago   11.7MB
busybox      uclibc    3e516f71d880   2 hours ago   2.4MB
busybox      glibc     7338d0c72c65   2 hours ago   6.09MB
$ docker images --filter reference=alpine:latest --filter=reference=busybox
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
alpine       latest    7144f7bab3d4   2 hours ago   11.7MB
busybox      uclibc    3e516f71d880   2 hours ago   2.4MB
busybox      glibc     7338d0c72c65   2 hours ago   6.09MB
```

### 여러 부정 필터 {#multiple-negated-filters}

일부 명령어는 [레이블](/manuals/engine/manage-resources/labels.md)에 대한 부정 필터를 지원합니다.
부정 필터는 지정된 패턴과 일치하지 않는 결과만 고려합니다.
다음 명령어는 `foo` 레이블이 없는 모든 컨테이너를 정리합니다.

```console
$ docker container prune --filter "label!=foo"
```

여러 부정 레이블 필터를 결합하는 데는 주의할 점이 있습니다. 여러 부정 필터는 단일 부정 제약 조건(논리적 `AND`)를 만듭니다. 다음 명령어는 `foo`와 `bar` 둘 다 레이블이 없는 모든 컨테이너를 정리합니다.
`foo` 또는 `bar` 레이블이 있는 컨테이너는 정리됩니다.

```console
$ docker container prune --filter "label!=foo" --filter "label!=bar"
```

## 참조 {#reference}

필터링 명령어에 대한 자세한 내용은 `--filter` 플래그를 지원하는 명령어에 대한 CLI 참조 설명을 참조하십시오:

- [`docker config ls`](/reference/cli/docker/config/ls.md)
- [`docker container prune`](/reference/cli/docker/container/prune.md)
- [`docker image prune`](/reference/cli/docker/image/prune.md)
- [`docker image ls`](/reference/cli/docker/image/ls.md)
- [`docker network ls`](/reference/cli/docker/network/ls.md)
- [`docker network prune`](/reference/cli/docker/network/prune.md)
- [`docker node ls`](/reference/cli/docker/node/ls.md)
- [`docker node ps`](/reference/cli/docker/node/ps.md)
- [`docker plugin ls`](/reference/cli/docker/plugin/ls.md)
- [`docker container ls`](/reference/cli/docker/container/ls.md)
- [`docker search`](/reference/cli/docker/search.md)
- [`docker secret ls`](/reference/cli/docker/secret/ls.md)
- [`docker service ls`](/reference/cli/docker/service/ls.md)
- [`docker service ps`](/reference/cli/docker/service/ps.md)
- [`docker stack ps`](/reference/cli/docker/stack/ps.md)
- [`docker system prune`](/reference/cli/docker/system/prune.md)
- [`docker volume ls`](/reference/cli/docker/volume/ls.md)
- [`docker volume prune`](/reference/cli/docker/volume/prune.md)
