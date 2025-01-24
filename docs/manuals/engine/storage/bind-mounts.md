---
description: 바인드 마운트 사용
title: 바인드 마운트
weight: 20
keywords:
  - 스토리지
  - 지속성
  - 데이터 지속성
  - 마운트
  - 바인드 마운트
aliases:
  - /engine/admin/volumes/bind-mounts/
  - /storage/bind-mounts/
---

바인드 마운트를 사용하면 호스트 머신의 파일 또는 디렉토리가 컨테이너에 마운트됩니다.
반면에 볼륨을 사용하면 호스트 머신의 Docker 스토리지 디렉토리 내에 새 디렉토리가 생성되고
Docker가 해당 디렉토리의 내용을 관리합니다.

## 바인드 마운트를 사용할 때 {#when-to-use-bind-mounts}

바인드 마운트는 다음과 같은 유형의 사용 사례에 적합합니다:

- Docker 호스트의 개발 환경과 컨테이너 간에 소스 코드 또는 빌드 결과물을 공유할 때.

- 컨테이너에서 파일을 생성하거나 생성하고 해당 파일을 호스트의 파일 시스템에 저장하고자 할 때.

- 호스트 머신의 구성 파일을 컨테이너와 공유할 때. Docker는 기본적으로 호스트 머신의 `/etc/resolv.conf`를 각 컨테이너에 마운트하여 컨테이너가 DNS 이름을 확인할 수 있도록 제공합니다.

바인드 마운트는 빌드에도 사용할 수 있습니다: 호스트에서 소스 코드를 빌드 컨테이너에 바인드 마운트하여 테스트, 린트 또는 컴파일할 수 있습니다.

## 기존 데이터 위에 바인드 마운트하기 {#bind-mounting-over-existing-data}

파일 또는 디렉토리를 컨테이너의 디렉토리에 바인드 마운트하면
기존 파일이나 디렉토리가 마운트에 의해 가려집니다.
이는 Linux 호스트에서 `/mnt`에 파일을 저장한 후 USB 드라이브를 `/mnt`에 마운트한 경우와 유사합니다.
USB 드라이브가 언마운트될 때까지 `/mnt`의 내용이 USB 드라이브의 내용에 의해 가려집니다.

컨테이너의 경우, 마운트를 제거하여 가려진 파일을 다시 표시하는 간단한 방법이 없습니다.
가장 좋은 방법은 마운트 없이 컨테이너를 다시 생성하는 것입니다.

## 고려 사항 및 제약 조건 {#considerations-and-constraints}

- 바인드 마운트는 기본적으로 호스트의 파일에 쓰기 권한을 가집니다.

  바인드 마운트를 사용할 때의 부작용 중 하나는 컨테이너에서 실행되는 프로세스를 통해 호스트 파일 시스템을 변경할 수 있다는 것입니다.
  여기에는 중요한 시스템 파일이나 디렉토리를 생성, 수정 또는 삭제하는 것이 포함됩니다.
  이 기능은 보안에 영향을 미칠 수 있습니다. 예를 들어, 호스트 시스템의 Docker가 아닌 프로세스에 영향을 미칠 수 있습니다.

  `readonly` 또는 `ro` 옵션을 사용하여 컨테이너가 마운트에 쓰지 못하도록 할 수 있습니다.

- 바인드 마운트는 Docker 데몬 호스트에 생성됩니다, 클라이언트가 아닙니다.

  원격 Docker 데몬을 사용하는 경우, 클라이언트 머신의 파일에 접근하기 위해 바인드 마운트를 생성할 수 없습니다.

  Docker Desktop의 경우, 데몬은 네이티브 호스트가 아닌 Linux VM 내에서 실행됩니다.
  Docker Desktop은 바인드 마운트를 투명하게 처리하는 내장 메커니즘을 가지고 있어
  가상 머신에서 실행되는 컨테이너와 네이티브 호스트 파일 시스템 경로를 공유할 수 있습니다.

- 바인드 마운트를 사용하는 컨테이너는 호스트에 강하게 묶여 있습니다.

  바인드 마운트는 호스트 머신의 파일 시스템에 특정 디렉토리 구조가 있어야 합니다.
  이 의존성 때문에 바인드 마운트를 사용하는 컨테이너는 동일한 디렉토리 구조가 없는 다른 호스트에서 실행될 경우 실패할 수 있습니다.

## 구문 {#syntax}

바인드 마운트를 생성하려면 `--mount` 또는 `--volume` 플래그를 사용할 수 있습니다.

```console
$ docker run --mount type=bind,src=<host-path>,dst=<container-path>
$ docker run --volume <host-path>:<container-path>
```

일반적으로 `--mount`가 선호됩니다. 주요 차이점은 `--mount` 플래그가 더 명확하고 사용 가능한 모든 옵션을 지원한다는 것입니다.

`--volume`을 사용하여 Docker 호스트에 아직 존재하지 않는 파일 또는 디렉토리를 바인드 마운트하면,
Docker는 호스트에 디렉토리를 자동으로 생성합니다. 항상 디렉토리로 생성됩니다.

`--mount`는 호스트에 지정된 마운트 경로가 존재하지 않으면 디렉토리를 자동으로 생성하지 않습니다. 대신 오류를 발생시킵니다:

```console
$ docker run --mount type=bind,src=/dev/noexist,dst=/mnt/foo alpine
docker: Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /dev/noexist.
```

### --mount 옵션 {#options-for-mount}

`--mount` 플래그는 쉼표로 구분된 여러 키-값 쌍으로 구성되며 각 쌍은 `<key>=<value>` 튜플로 구성됩니다. 키의 순서는 중요하지 않습니다.

```console
$ docker run --mount type=bind,src=<host-path>,dst=<container-path>[,<key>=<value>...]
```

`--mount type=bind`에 대한 유효한 옵션은 다음과 같습니다:

| 옵션                           | 설명                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `source`, `src`                | 호스트의 파일 또는 디렉토리 위치. 절대 경로 또는 상대 경로일 수 있습니다.                            |
| `destination`, `dst`, `target` | 컨테이너에 파일 또는 디렉토리가 마운트되는 경로. 절대 경로여야 합니다.                               |
| `readonly`, `ro`               | 존재하는 경우, 바인드 마운트를 [읽기 전용으로 컨테이너에 마운트](#use-a-read-only-bind-mount)합니다. |
| `bind-propagation`             | 존재하는 경우, [바인드 전파](#configure-bind-propagation)를 변경합니다.                              |

```console {title="예제"}
$ docker run --mount type=bind,src=.,dst=/project,ro,bind-propagation=rshared
```

### --volume 옵션 {#options-for-volume}

`--volume` 또는 `-v` 플래그는 콜론 문자(`:`)로 구분된 세 개의 필드로 구성됩니다. 필드는 올바른 순서로 있어야 합니다.

```console
$ docker run -v <host-path>:<container-path>[:opts]
```

첫 번째 필드는 컨테이너에 바인드 마운트할 호스트의 경로입니다.
두 번째 필드는 컨테이너에 파일 또는 디렉토리가 마운트되는 경로입니다.

세 번째 필드는 선택 사항이며, 옵션의 쉼표로 구분된 목록입니다. 바인드 마운트와 함께 `--volume`에 대한 유효한 옵션은 다음과 같습니다:

| 옵션                | 설명                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `readonly`, `ro`    | 존재하는 경우, 바인드 마운트를 [읽기 전용으로 컨테이너에 마운트](#use-a-read-only-bind-mount)합니다.          |
| `z`, `Z`            | SELinux 레이블을 구성합니다. [SELinux 레이블 구성](#configure-the-selinux-label) 참조                         |
| `rprivate` (기본값) | 이 마운트에 대해 바인드 전파를 `rprivate`로 설정합니다. [바인드 전파 구성](#configure-bind-propagation) 참조. |
| `private`           | 이 마운트에 대해 바인드 전파를 `private`로 설정합니다. [바인드 전파 구성](#configure-bind-propagation) 참조.  |
| `rshared`           | 이 마운트에 대해 바인드 전파를 `rshared`로 설정합니다. [바인드 전파 구성](#configure-bind-propagation) 참조.  |
| `shared`            | 이 마운트에 대해 바인드 전파를 `shared`로 설정합니다. [바인드 전파 구성](#configure-bind-propagation) 참조.   |
| `rslave`            | 이 마운트에 대해 바인드 전파를 `rslave`로 설정합니다. [바인드 전파 구성](#configure-bind-propagation) 참조.   |
| `slave`             | 이 마운트에 대해 바인드 전파를 `slave`로 설정합니다. [바인드 전파 구성](#configure-bind-propagation) 참조.    |

```console {title="예제"}
$ docker run -v .:/project:ro,rshared
```

## 바인드 마운트를 사용하여 컨테이너 시작 {#start-a-container-with-a-bind-mount}

디렉토리 `source`가 있고 소스 코드를 빌드할 때
빌드 결과물이 `source/target/` 디렉토리에 저장된다고 가정해 보겠습니다.
빌드 결과물을 `/app/`에서 컨테이너에서 사용할 수 있도록 하고
개발 호스트에서 소스를 빌드할 때마다 컨테이너가 새 빌드에 접근할 수 있도록 하고자 합니다.
다음 명령을 사용하여 `target/` 디렉토리를 `/app/`에 바인드 마운트합니다. `source` 디렉토리 내에서 명령을 실행합니다.
`$(pwd)` 하위 명령은 Linux 또는 macOS 호스트에서 현재 작업 디렉토리로 확장됩니다.
Windows를 사용하는 경우 [Windows에서 경로 변환](/manuals/desktop/troubleshoot-and-support/troubleshoot/topics.md)도 참조하십시오.

다음 `--mount` 및 `-v` 예제는 동일한 결과를 생성합니다. 첫 번째 예제를 실행한 후 `devtest` 컨테이너를 제거하지 않으면 둘 다 실행할 수 없습니다.

<Tabs>
<TabItem value="--mount" label="--mount">

```console
$ docker run -d \
  -it \
  --name devtest \
  --mount type=bind,source="$(pwd)"/target,target=/app \
  nginx:latest
```

</TabItem>
<TabItem value="-v" label="-v">

```console
$ docker run -d \
  -it \
  --name devtest \
  -v "$(pwd)"/target:/app \
  nginx:latest
```

</TabItem>
</Tabs>

`docker inspect devtest`를 사용하여 바인드 마운트가 올바르게 생성되었는지 확인하십시오. `Mounts` 섹션을 찾습니다:

```json
"Mounts": [
    {
        "Type": "bind",
        "Source": "/tmp/source/target",
        "Destination": "/app",
        "Mode": "",
        "RW": true,
        "Propagation": "rprivate"
    }
],
```

이것은 마운트가 `bind` 마운트임을 보여주며, 올바른 소스와 목적지를 보여주고,
마운트가 읽기-쓰기 가능하며, 전파가 `rprivate`로 설정되어 있음을 보여줍니다.

컨테이너를 중지하고 제거합니다:

```console
$ docker container rm -fv devtest
```

### 컨테이너의 비어 있지 않은 디렉토리에 마운트 {#mount-into-a-non-empty-directory-on-the-container}

디렉토리를 컨테이너의 비어 있지 않은 디렉토리에 바인드 마운트하면
디렉토리의 기존 내용이 바인드 마운트에 의해 가려집니다.
이는 새 버전의 애플리케이션을 빌드하지 않고 테스트하려는 경우 유용할 수 있습니다.
그러나 놀라울 수 있으며 이 동작은 [볼륨](volumes.md)의 동작과 다릅니다.

이 예제는 극단적으로 설정되어 있지만, 호스트 머신의 `/tmp/` 디렉토리로 컨테이너의 `/usr/` 디렉토리 내용을 대체합니다.
대부분의 경우, 이는 비작동 컨테이너를 초래합니다.

`--mount` 및 `-v` 예제는 동일한 결과를 가집니다.

<Tabs>
<TabItem value="--mount" label="--mount">

```console
$ docker run -d \
  -it \
  --name broken-container \
  --mount type=bind,source=/tmp,target=/usr \
  nginx:latest

docker: Error response from daemon: oci runtime error: container_linux.go:262:
starting container process caused "exec: \"nginx\": executable file not found in $PATH".
```

</TabItem>
<TabItem value="-v" label="-v">

```console
$ docker run -d \
  -it \
  --name broken-container \
  -v /tmp:/usr \
  nginx:latest

docker: Error response from daemon: oci runtime error: container_linux.go:262:
starting container process caused "exec: \"nginx\": executable file not found in $PATH".
```

</TabItem>
</Tabs>

컨테이너가 생성되지만 시작되지 않습니다. 제거합니다:

```console
$ docker container rm broken-container
```

## 읽기 전용 바인드 마운트 사용 {#use-a-read-only-bind-mount}

일부 개발 애플리케이션의 경우, 컨테이너가 바인드 마운트에 쓰기해야 하므로
변경 사항이 Docker 호스트에 다시 전파됩니다. 다른 경우에는 컨테이너가 읽기 권한만 필요합니다.

이 예제는 이전 예제를 수정하지만, 디렉토리를 읽기 전용 바인드 마운트로 마운트하여
옵션 목록(기본적으로 비어 있음)에 `ro`를 추가합니다. 여러 옵션이 있는 경우 쉼표로 구분합니다.

`--mount` 및 `-v` 예제는 동일한 결과를 가집니다.

<Tabs>
<TabItem value="--mount" label="--mount">

```console
$ docker run -d \
  -it \
  --name devtest \
  --mount type=bind,source="$(pwd)"/target,target=/app,readonly \
  nginx:latest
```

</TabItem>
<TabItem value="-v" label="-v">

```console
$ docker run -d \
  -it \
  --name devtest \
  -v "$(pwd)"/target:/app:ro \
  nginx:latest
```

</TabItem>
</Tabs>

`docker inspect devtest`를 사용하여 바인드 마운트가 올바르게 생성되었는지 확인하십시오. `Mounts` 섹션을 찾습니다:

```json
"Mounts": [
    {
        "Type": "bind",
        "Source": "/tmp/source/target",
        "Destination": "/app",
        "Mode": "ro",
        "RW": false,
        "Propagation": "rprivate"
    }
],
```

컨테이너를 중지하고 제거합니다:

```console
$ docker container rm -fv devtest
```

## 재귀적 마운트 {#recursive-mounts}

마운트 자체에 마운트가 포함된 경로를 바인드 마운트하면, 기본적으로 해당 하위 마운트도 바인드 마운트에 포함됩니다.
이 동작은 `--mount`의 `bind-recursive` 옵션을 사용하여 구성할 수 있습니다. 이 옵션은 `--mount` 플래그에서만 지원되며 `-v` 또는 `--volume`에서는 지원되지 않습니다.

바인드 마운트가 읽기 전용인 경우, Docker 엔진은 하위 마운트를 읽기 전용으로 만들기 위해 최선을 다합니다.
이를 재귀적 읽기 전용 마운트라고 합니다. 재귀적 읽기 전용 마운트는 Linux 커널 버전 5.12 이상이 필요합니다.
이전 커널 버전을 실행 중인 경우, 하위 마운트는 기본적으로 자동으로 읽기-쓰기 가능으로 마운트됩니다.
커널 버전 5.12 이전에서 하위 마운트를 읽기 전용으로 설정하려고 하면, `bind-recursive=readonly` 옵션을 사용하여 오류가 발생합니다.

`bind-recursive` 옵션에 대한 지원되는 값은 다음과 같습니다:

| 값                 | 설명                                                                                                                               |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| `enabled` (기본값) | 커널이 v5.12 이상인 경우 읽기 전용 마운트가 재귀적으로 읽기 전용으로 설정됩니다. 그렇지 않으면 하위 마운트는 읽기-쓰기 가능입니다. |
| `disabled`         | 하위 마운트는 무시됩니다 (바인드 마운트에 포함되지 않음).                                                                          |
| `writable`         | 하위 마운트는 읽기-쓰기 가능입니다.                                                                                                |
| `readonly`         | 하위 마운트는 읽기 전용입니다. 커널 v5.12 이상이 필요합니다.                                                                       |

## 바인드 전파 구성 {#configure-bind-propagation}

바인드 전파는 바인드 마운트와 볼륨 모두에 대해 기본적으로 `rprivate`로 설정됩니다. 이는 바인드 마운트에 대해서만 구성할 수 있으며, Linux 호스트 머신에서만 가능합니다.
바인드 전파는 고급 주제이며 많은 사용자가 이를 구성할 필요가 없습니다.

바인드 전파는 주어진 바인드 마운트 내에서 생성된 마운트가 해당 마운트의 복제본에 전파될 수 있는지 여부를 나타냅니다.
마운트 포인트 `/mnt`가 `/tmp`에도 마운트된다고 가정해 보겠습니다. 전파 설정은
`/tmp/a`에 마운트된 항목이 `/mnt/a`에서도 사용할 수 있는지 여부를 제어합니다. 각 전파 설정에는 재귀적 카운터파트가 있습니다.
재귀의 경우, `/tmp/a`가 `/foo`로도 마운트된다고 가정해 보겠습니다. 전파 설정은 `/mnt/a` 및/또는 `/tmp/a`가 존재하는지 여부를 제어합니다.

:::note
마운트 전파는 Docker Desktop에서 작동하지 않습니다.
:::

| 전파 설정  | 설명                                                                                                                                                                                                              |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared`   | 원래 마운트의 하위 마운트가 복제본 마운트에 노출되며, 복제본 마운트의 하위 마운트도 원래 마운트에 전파됩니다.                                                                                                     |
| `slave`    | 공유 마운트와 유사하지만 한 방향으로만 작동합니다. 원래 마운트가 하위 마운트를 노출하면 복제본 마운트에서 이를 볼 수 있습니다. 그러나 복제본 마운트가 하위 마운트를 노출하면 원래 마운트에서 이를 볼 수 없습니다. |
| `private`  | 마운트는 비공개입니다. 그 안의 하위 마운트는 복제본 마운트에 노출되지 않으며, 복제본 마운트의 하위 마운트도 원래 마운트에 노출되지 않습니다.                                                                      |
| `rshared`  | 공유와 동일하지만, 전파는 원래 또는 복제본 마운트 포인트 내에 중첩된 마운트 포인트로 확장됩니다.                                                                                                                  |
| `rslave`   | slave와 동일하지만, 전파는 원래 또는 복제본 마운트 포인트 내에 중첩된 마운트 포인트로 확장됩니다.                                                                                                                 |
| `rprivate` | 기본값. private와 동일하며, 원래 또는 복제본 마운트 포인트 내의 어느 곳에서도 마운트 포인트가 어느 방향으로도 전파되지 않습니다.                                                                                  |

바인드 전파를 마운트 포인트에 설정하기 전에, 호스트 파일 시스템이 이미 바인드 전파를 지원해야 합니다.

바인드 전파에 대한 자세한 내용은
[Linux 커널 문서의 공유 하위 트리](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)를 참조하십시오.

다음 예제는 `target/` 디렉토리를 컨테이너에 두 번 마운트하며, 두 번째 마운트는 `ro` 옵션과 `rslave` 바인드 전파 옵션을 모두 설정합니다.

`--mount` 및 `-v` 예제는 동일한 결과를 가집니다.

<Tabs>
<TabItem value="`--mount`" label="`--mount`">

```console
$ docker run -d \
  -it \
  --name devtest \
  --mount type=bind,source="$(pwd)"/target,target=/app \
  --mount type=bind,source="$(pwd)"/target,target=/app2,readonly,bind-propagation=rslave \
  nginx:latest
```

</TabItem>
<TabItem value="`-v`" label="`-v`">

```console
$ docker run -d \
  -it \
  --name devtest \
  -v "$(pwd)"/target:/app \
  -v "$(pwd)"/target:/app2:ro,rslave \
  nginx:latest
```

</TabItem>
</Tabs>

이제 `/app/foo/`를 생성하면 `/app2/foo/`도 존재합니다.

## SELinux 레이블 구성 {#configure-the-selinux-label}

SELinux를 사용하는 경우, `z` 또는 `Z` 옵션을 추가하여
컨테이너에 마운트되는 호스트 파일 또는 디렉토리의 SELinux 레이블을 수정할 수 있습니다.
이는 호스트 머신 자체의 파일 또는 디렉토리에 영향을 미치며 Docker의 범위를 벗어난 결과를 초래할 수 있습니다.

- `z` 옵션은 바인드 마운트 콘텐츠가 여러 컨테이너 간에 공유됨을 나타냅니다.
- `Z` 옵션은 바인드 마운트 콘텐츠가 비공개이며 공유되지 않음을 나타냅니다.

이 옵션을 사용할 때는 극도로 주의하십시오. `Z` 옵션을 사용하여 `/home` 또는 `/usr`와 같은 시스템 디렉토리를 바인드 마운트하면
호스트 머신이 작동하지 않게 되며 수동으로 호스트 머신 파일의 레이블을 다시 지정해야 할 수 있습니다.

:::important
서비스에서 바인드 마운트를 사용할 때, SELinux 레이블
(`:Z` 및 `:z`), 뿐만 아니라 `:ro`는 무시됩니다. 자세한 내용은
[moby/moby #32579](https://github.com/moby/moby/issues/32579)를 참조하십시오.
:::

이 예제는 여러 컨테이너가 바인드 마운트의 콘텐츠를 공유할 수 있음을 지정하기 위해 `z` 옵션을 설정합니다:

`--mount` 플래그를 사용하여 SELinux 레이블을 수정하는 것은 불가능합니다.

```console
$ docker run -d \
  -it \
  --name devtest \
  -v "$(pwd)"/target:/app:z \
  nginx:latest
```

## Docker Compose와 함께 바인드 마운트 사용 {#use-a-bind-mount-with-docker-compose}

바인드 마운트를 사용하는 단일 Docker Compose 서비스는 다음과 같습니다:

```yaml
services:
  frontend:
    image: node:lts
    volumes:
      - type: bind
        source: ./static
        target: /opt/app/static
volumes:
  myapp:
```

Compose에서 `bind` 유형의 볼륨을 사용하는 것에 대한 자세한 내용은
[Compose 파일의 볼륨 참조](/reference/compose-file/services.md#volumes)를 참조하십시오.
및
[Compose 파일의 볼륨 구성 참조](/reference/compose-file/services.md#volumes)를 참조하십시오.

## 다음 단계 {#next-steps}

- [볼륨](./volumes.md)에 대해 알아보십시오.
- [tmpfs 마운트](./tmpfs.md)에 대해 알아보십시오.
- [스토리지 드라이버](/engine/storage/drivers/)에 대해 알아보십시오.
