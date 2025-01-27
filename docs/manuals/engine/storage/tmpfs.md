---
description: tmpfs 마운트 사용
title: tmpfs 마운트
weight: 30
keywords:
  - 스토리지
  - 지속성
  - 데이터 지속성
  - tmpfs
aliases:
  - /engine/admin/volumes/tmpfs/
  - /storage/tmpfs/
---

[볼륨](volumes.md) 및 [바인드 마운트](bind-mounts.md)를 사용하면 호스트 머신과 컨테이너 간에 파일을 공유하여 컨테이너가 중지된 후에도 데이터를 지속할 수 있습니다.

Docker를 Linux에서 실행하는 경우 세 번째 옵션인 tmpfs 마운트를 사용할 수 있습니다. tmpfs 마운트를 사용하여 컨테이너를 생성하면 컨테이너의 쓰기 가능한 레이어 외부에 파일을 생성할 수 있습니다.

볼륨 및 바인드 마운트와 달리 tmpfs 마운트는 임시이며 호스트 메모리에만 저장됩니다. 컨테이너가 중지되면 tmpfs 마운트가 제거되며, 그곳에 작성된 파일은 지속되지 않습니다.

tmpfs 마운트는 호스트 머신이나 컨테이너 내에 데이터를 지속하지 않으려는 경우에 가장 적합합니다. 이는 보안상의 이유이거나 애플리케이션이 대량의 유지되지 않는 상태 데이터를 기록해야 할 때 컨테이너의 성능을 보호하기 위함일 수 있습니다.

:::important
Docker의 tmpfs 마운트는 Linux 커널의 [tmpfs](https://en.wikipedia.org/wiki/Tmpfs)와 직접적으로 매핑됩니다. 따라서 임시 데이터는 스왑 파일에 기록될 수 있으며, 파일 시스템에 지속될 수 있습니다.
:::

## 기존 데이터 위에 마운트하기 {#mounting-over-existing-data}

컨테이너의 디렉토리에 tmpfs 마운트를 생성하면 해당 디렉토리에 존재하는 파일이나 디렉토리가 마운트에 의해 가려집니다. 이는 Linux 호스트에서 `/mnt`에 파일을 저장한 후 USB 드라이브를 `/mnt`에 마운트하는 것과 유사합니다. USB 드라이브가 마운트 해제될 때까지 `/mnt`의 내용이 USB 드라이브의 내용에 의해 가려집니다.

컨테이너의 경우 마운트를 제거하여 가려진 파일을 다시 표시하는 간단한 방법이 없습니다. 가장 좋은 방법은 마운트 없이 컨테이너를 다시 생성하는 것입니다.

## tmpfs 마운트의 제한 사항 {#limitations-of-tmpfs-mounts}

- 볼륨 및 바인드 마운트와 달리 tmpfs 마운트는 컨테이너 간에 공유할 수 없습니다.
- 이 기능은 Docker를 Linux에서 실행하는 경우에만 사용할 수 있습니다.
- tmpfs에 권한을 설정하면 [컨테이너 재시작 후 재설정](https://github.com/docker/for-linux/issues/138)될 수 있습니다. 일부 경우 [uid/gid 설정](https://github.com/docker/compose/issues/3425#issuecomment-423091370)이 해결책이 될 수 있습니다.

## 구문 {#syntax}

`docker run` 명령어를 사용하여 tmpfs를 마운트하려면 `--mount` 또는 `--tmpfs` 플래그를 사용할 수 있습니다.

```bash
$ docker run --mount type=tmpfs,dst=<mount-path>
$ docker run --tmpfs <mount-path>
```

일반적으로 `--mount`가 선호됩니다. 주요 차이점은 `--mount` 플래그가 더 명확하다는 것입니다. 반면에 `--tmpfs`는 덜 장황하며 더 많은 마운트 옵션을 설정할 수 있어 유연성을 제공합니다.

`--tmpfs` 플래그는 스웜 서비스와 함께 사용할 수 없습니다. `--mount`를 사용해야 합니다.

### --tmpfs 옵션 {#options-for-tmpfs}

`--tmpfs` 플래그는 콜론 문자(`:`)로 구분된 두 개의 필드로 구성됩니다.

```bash
$ docker run --tmpfs <mount-path>[:opts]
```

첫 번째 필드는 tmpfs로 마운트할 컨테이너 경로입니다. 두 번째 필드는 선택 사항이며 마운트 옵션을 설정할 수 있습니다. `--tmpfs`에 유효한 마운트 옵션은 다음과 같습니다:

| 옵션         | 설명                                                                      |
| ------------ | ------------------------------------------------------------------------- |
| `ro`         | 읽기 전용 tmpfs 마운트를 생성합니다.                                      |
| `rw`         | 읽기-쓰기 tmpfs 마운트를 생성합니다(기본 동작).                           |
| `nosuid`     | 실행 중 `setuid` 및 `setgid` 비트를 무시합니다.                           |
| `suid`       | 실행 중 `setuid` 및 `setgid` 비트를 허용합니다(기본 동작).                |
| `nodev`      | 장치 파일을 생성할 수 있지만 기능하지 않습니다(접근 시 오류 발생).        |
| `dev`        | 장치 파일을 생성할 수 있으며 완전히 작동합니다.                           |
| `exec`       | 마운트된 파일 시스템에서 실행 가능한 바이너리의 실행을 허용합니다.        |
| `noexec`     | 마운트된 파일 시스템에서 실행 가능한 바이너리의 실행을 허용하지 않습니다. |
| `sync`       | 파일 시스템에 대한 모든 I/O가 동기적으로 수행됩니다.                      |
| `async`      | 파일 시스템에 대한 모든 I/O가 비동기적으로 수행됩니다(기본 동작).         |
| `dirsync`    | 파일 시스템 내의 디렉토리 업데이트가 동기적으로 수행됩니다.               |
| `atime`      | 파일이 접근될 때마다 파일 접근 시간을 업데이트합니다.                     |
| `noatime`    | 파일이 접근될 때 파일 접근 시간을 업데이트하지 않습니다.                  |
| `diratime`   | 디렉토리가 접근될 때마다 디렉토리 접근 시간을 업데이트합니다.             |
| `nodiratime` | 디렉토리가 접근될 때 디렉토리 접근 시간을 업데이트하지 않습니다.          |
| `size`       | tmpfs 마운트의 크기를 지정합니다(예: `size=64m`).                         |
| `mode`       | tmpfs 마운트의 파일 모드(권한)를 지정합니다(예: `mode=1777`).             |
| `uid`        | tmpfs 마운트 소유자의 사용자 ID를 지정합니다(예: `uid=1000`).             |
| `gid`        | tmpfs 마운트 소유자의 그룹 ID를 지정합니다(예: `gid=1000`).               |
| `nr_inodes`  | tmpfs 마운트의 최대 inode 수를 지정합니다(예: `nr_inodes=400k`).          |
| `nr_blocks`  | tmpfs 마운트의 최대 블록 수를 지정합니다(예: `nr_blocks=1024`).           |

```bash {title="예제"}
$ docker run --tmpfs /data:noexec,size=1024,mode=1777
```

Linux 마운트 명령어에서 사용할 수 있는 모든 tmpfs 마운트 기능이 `--tmpfs` 플래그와 함께 지원되는 것은 아닙니다. 고급 tmpfs 옵션이나 기능이 필요한 경우 권한이 있는 컨테이너를 사용하거나 Docker 외부에서 마운트를 구성해야 할 수 있습니다.

:::caution
`--privileged`로 컨테이너를 실행하면 권한이 상승되며 호스트 시스템이 보안 위험에 노출될 수 있습니다. 이 옵션은 절대적으로 필요한 경우에만 신뢰할 수 있는 환경에서 사용하십시오.
:::

```bash
$ docker run --privileged -it debian sh
/# mount -t tmpfs -o <options> tmpfs /data
```

### --mount 옵션 {#options-for-mount}

`--mount` 플래그는 쉼표로 구분된 여러 키-값 쌍으로 구성되며 각 쌍은 `<key>=<value>` 튜플로 구성됩니다. 키의 순서는 중요하지 않습니다.

```bash
$ docker run --mount type=tmpfs,dst=<mount-path>[,<key>=<value>...]
```

`--mount type=tmpfs`에 유효한 옵션은 다음과 같습니다:

| 옵션                           | 설명                                                                                                          |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `destination`, `dst`, `target` | tmpfs 마운트의 크기(바이트 단위). 설정되지 않은 경우 tmpfs 볼륨의 기본 최대 크기는 호스트 총 RAM의 50%입니다. |
| `tmpfs-size`                   | tmpfs 마운트의 크기(바이트 단위). 설정되지 않은 경우 tmpfs 볼륨의 기본 최대 크기는 호스트 총 RAM의 50%입니다. |
| `tmpfs-mode`                   | tmpfs의 파일 모드(8진수). 예를 들어, `700` 또는 `0770`. 기본값은 `1777` 또는 전 세계 쓰기 가능입니다.         |

```bash {title="예제"}
$ docker run --mount type=tmpfs,dst=/app,tmpfs-size=21474836480,tmpfs-mode=1770
```

## 컨테이너에서 tmpfs 마운트 사용 {#use-a-tmpfs-mount-in-a-container}

컨테이너에서 `tmpfs` 마운트를 사용하려면 `--tmpfs` 플래그를 사용하거나 `type=tmpfs` 및 `destination` 옵션과 함께 `--mount` 플래그를 사용하십시오. `tmpfs` 마운트에는 `source`가 없습니다. 다음 예제는 Nginx 컨테이너에서 `/app`에 `tmpfs` 마운트를 생성합니다. 첫 번째 예제는 `--mount` 플래그를 사용하고 두 번째 예제는 `--tmpfs` 플래그를 사용합니다.

<Tabs>
<TabItem value="--mount" label="--mount">

```bash
$ docker run -d \
  -it \
  --name tmptest \
  --mount type=tmpfs,destination=/app \
  nginx:latest
```

`docker inspect` 출력의 `Mounts` 섹션을 확인하여 마운트가 `tmpfs` 마운트인지 확인하십시오:

```bash
$ docker inspect tmptest --format '{{ json .Mounts }}'
[{"Type":"tmpfs","Source":"","Destination":"/app","Mode":"","RW":true,"Propagation":""}]
```

</TabItem>
<TabItem value="--tmpfs" label="--tmpfs">

```bash
$ docker run -d \
  -it \
  --name tmptest \
  --tmpfs /app \
  nginx:latest
```

`docker inspect` 출력의 `Mounts` 섹션을 확인하여 마운트가 `tmpfs` 마운트인지 확인하십시오:

```bash
$ docker inspect tmptest --format '{{ json .Mounts }}'
{"/app":""}
```

</TabItem>
</Tabs>

컨테이너를 중지하고 제거하십시오:

```bash
$ docker stop tmptest
$ docker rm tmptest
```

## 다음 단계 {#next-steps}

- [볼륨](volumes.md)에 대해 알아보기
- [바인드 마운트](bind-mounts.md)에 대해 알아보기
- [스토리지 드라이버](/engine/storage/drivers/)에 대해 알아보기
