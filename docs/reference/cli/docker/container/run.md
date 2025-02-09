---
datafolder: engine-cli
datafile: docker_container_run
linkTitle: docker run
title: 도커 컨테이너 실행
aliases:
  - /engine/reference/commandline/container_run/
  - /engine/reference/commandline/run/
  - /reference/cli/docker/run/
layout: cli
---

# 도커 컨테이너 실행 {#docker-container-run}

| 항목            | 내용                                                      |
| --------------- | --------------------------------------------------------- |
| **Usage**       | `docker container run [OPTIONS] IMAGE [COMMAND] [ARG...]` |
| **Description** | 이미지에서 새 컨테이너를 생성하고 실행                    |
| **Aliases**     | `docker container run` `docker run`                       |

## 설명 {#description}

`docker run` 명령은 새 컨테이너에서 명령을 실행하며, 필요 시 이미지를 가져오고 컨테이너를 시작합니다.

중지된 컨테이너를 모든 이전 변경 사항을 유지한 채로 다시 시작하려면 `docker start`를 사용하십시오.
중지된 컨테이너를 포함한 모든 컨테이너 목록을 보려면 `docker ps -a`를 사용하십시오.

## 옵션 {#options}

| 옵션                      | 기본값    | 설명                                                                             |
| ------------------------- | --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | -------------------- |
| `--add-host`              |           | 사용자 정의 호스트-대-IP 매핑 추가 (host:ip)                                     |
| `--annotation`            |           | 컨테이너에 주석 추가 (OCI 런타임에 전달됨)<br />                                 |
| `-a --attach`             |           | STDIN, STDOUT 또는 STDERR에 연결                                                 |
| `--blkio-weight`          |           | 블록 IO (상대적 가중치), 10에서 1000 사이 또는 비활성화하려면 0 (기본값 0)<br /> |
| `--blkio-weight-device`   |           | 블록 IO 가중치 (상대적 장치 가중치)                                              |
| `--cap-add`               |           | Linux 기능 추가                                                                  |
| `--cap-drop`              |           | Linux 기능 제거                                                                  |
| `--cgroup-parent`         |           | 컨테이너의 선택적 상위 cgroup                                                    |
| `--cgroupns`              |           | 사용할 cgroup 네임스페이스 (host                                                 | private)<br />'host': Docker 호스트의 cgroup 네임스페이스에서 컨테이너 실행<br />'private': 컨테이너를 자체 개인 cgroup 네임스페이스에서 실행<br />'': 데몬의 default-cgroupns-mode 옵션으로 구성된 cgroup 네임스페이스 사용 (기본값) |
| `--cidfile`               |           | 파일에 컨테이너 ID 쓰기                                                          |
| `--cpu-count`             |           | CPU 수 (Windows 전용)                                                            |
| `--cpu-percent`           |           | CPU 백분율 (Windows 전용)                                                        |
| `--cpu-period`            |           | CPU CFS (Completely Fair Scheduler) 주기 제한                                    |
| `--cpu-quota`             |           | CPU CFS (Completely Fair Scheduler) 할당량 제한                                  |
| `--cpu-rt-period`         |           | 마이크로초 단위의 CPU 실시간 주기 제한                                           |
| `--cpu-rt-runtime`        |           | 마이크로초 단위의 CPU 실시간 런타임 제한                                         |
| `-c --cpu-shares`         |           | CPU 공유 (상대적 가중치)                                                         |
| `--cpus`                  |           | CPU 수                                                                           |
| `--cpuset-cpus`           |           | 실행을 허용할 CPU (0-3, 0,1)                                                     |
| `--cpuset-mems`           |           | 실행을 허용할 MEM (0-3, 0,1)                                                     |
| `-d --detach`             |           | 백그라운드에서 컨테이너 실행 및 컨테이너 ID 출력                                 |
| `--detach-keys`           |           | 컨테이너 분리 키 시퀀스 재정의                                                   |
| `--device`                |           | 호스트 장치를 컨테이너에 추가                                                    |
| `--device-cgroup-rule`    |           | cgroup 허용 장치 목록에 규칙 추가                                                |
| `--device-read-bps`       |           | 장치에서 읽기 속도 (초당 바이트) 제한                                            |
| `--device-read-iops`      |           | 장치에서 읽기 속도 (초당 IO) 제한                                                |
| `--device-write-bps`      |           | 장치에 쓰기 속도 (초당 바이트) 제한                                              |
| `--device-write-iops`     |           | 장치에 쓰기 속도 (초당 IO) 제한                                                  |
| `--disable-content-trust` | `true`    | 이미지 검증 건너뛰기                                                             |
| `--dns`                   |           | 사용자 정의 DNS 서버 설정                                                        |
| `--dns-opt`               |           | DNS 옵션 설정                                                                    |
| `--dns-option`            |           | DNS 옵션 설정                                                                    |
| `--dns-search`            |           | 사용자 정의 DNS 검색 도메인 설정                                                 |
| `--domainname`            |           | 컨테이너 NIS 도메인 이름                                                         |
| `--entrypoint`            |           | 이미지의 기본 ENTRYPOINT 덮어쓰기                                                |
| `-e --env`                |           | 환경 변수 설정                                                                   |
| `--env-file`              |           | 환경 변수 파일 읽기                                                              |
| `--expose`                |           | 포트 또는 포트 범위 노출                                                         |
| `--gpus`                  |           | 컨테이너에 추가할 GPU 장치 ('all'은 모든 GPU 전달)                               |
| `--group-add`             |           | 추가 그룹에 가입                                                                 |
| `--health-cmd`            |           | 상태 확인을 위한 명령                                                            |
| `--health-interval`       |           | 상태 확인 간격 (ms                                                               | s                                                                                                                                                                                                                                     | m   | h) (기본값 0s)       |
| `--health-retries`        |           | 비정상으로 보고하기 위한 연속 실패 횟수                                          |
| `--health-start-interval` |           | 시작 기간 동안 상태 확인 간격 (ms                                                | s                                                                                                                                                                                                                                     | m   | h) (기본값 0s)<br /> |
| `--health-start-period`   |           | 상태 확인 재시도 카운트다운을 시작하기 전에 컨테이너를 초기화하는 시작 기간 (ms  | s                                                                                                                                                                                                                                     | m   | h) (기본값 0s)<br /> |
| `--health-timeout`        |           | 하나의 상태 확인을 실행할 최대 시간 (ms                                          | s                                                                                                                                                                                                                                     | m   | h) (기본값 0s)       |
| `--help`                  |           | 사용법 출력                                                                      |
| `-h --hostname`           |           | 컨테이너 호스트 이름                                                             |
| `--init`                  |           | 신호를 전달하고 프로세스를 수확하는 init을 컨테이너 내부에서 실행<br />          |
| `-i --interactive`        |           | 연결되지 않은 경우에도 STDIN 열기 유지                                           |
| `--io-maxbandwidth`       |           | 시스템 드라이브의 최대 IO 대역폭 제한 (Windows 전용)                             |
| `--io-maxiops`            |           | 시스템 드라이브의 최대 IOps 제한 (Windows 전용)                                  |
| `--ip`                    |           | IPv4 주소 (예: 172.30.100.104)                                                   |
| `--ip6`                   |           | IPv6 주소 (예: 2001:db8::33)                                                     |
| `--ipc`                   |           | 사용할 IPC 모드                                                                  |
| `--isolation`             |           | 컨테이너 격리 기술                                                               |
| `--kernel-memory`         |           | 커널 메모리 제한                                                                 |
| `-l --label`              |           | 컨테이너에 메타 데이터 설정                                                      |
| `--label-file`            |           | 라벨이 포함된 파일 읽기                                                          |
| `--link`                  |           | 다른 컨테이너에 링크 추가                                                        |
| `--link-local-ip`         |           | 컨테이너 IPv4/IPv6 링크-로컬 주소                                                |
| `--log-driver`            |           | 컨테이너의 로깅 드라이버                                                         |
| `--log-opt`               |           | 로그 드라이버 옵션                                                               |
| `--mac-address`           |           | 컨테이너 MAC 주소 (예: 92:d0:c6:0a:29:33)                                        |
| `-m --memory`             | `0`       | 메모리 제한                                                                      |
| `--memory-reservation`    |           | 메모리 소프트 제한                                                               |
| `--memory-swap`           | `0`       | 메모리와 스왑을 합친 스왑 제한: '-1'은 무제한 스왑 활성화<br />                  |
| `--memory-swappiness`     | `-1`      | 컨테이너 메모리 스와피니스 조정 (0에서 100)                                      |
| `--mount`                 |           | 컨테이너에 파일 시스템 마운트 연결                                               |
| `--name`                  |           | 컨테이너에 이름 할당                                                             |
| `--net`                   |           | 컨테이너를 네트워크에 연결                                                       |
| `--net-alias`             |           | 컨테이너에 네트워크 범위 별칭 추가                                               |
| `--network`               |           | 컨테이너를 네트워크에 연결                                                       |
| `--network-alias`         |           | 컨테이너에 네트워크 범위 별칭 추가                                               |
| `--no-healthcheck`        |           | 컨테이너에 지정된 HEALTHCHECK 비활성화                                           |
| `--oom-kill-disable`      |           | OOM 킬러 비활성화                                                                |
| `--oom-score-adj`         |           | 호스트의 OOM 선호도 조정 (-1000에서 1000)                                        |
| `--pid`                   |           | 사용할 PID 네임스페이스                                                          |
| `--pids-limit`            |           | 컨테이너 pids 제한 조정 (무제한으로 설정하려면 -1)                               |
| `--platform`              |           | 서버가 다중 플랫폼을 지원하는 경우 플랫폼 설정                                   |
| `--privileged`            |           | 이 컨테이너에 확장된 권한 부여                                                   |
| `-p --publish`            |           | 컨테이너의 포트(들)를 호스트에 게시                                              |
| `-P --publish-all`        |           | 모든 노출된 포트를 임의의 포트로 게시                                            |
| `--pull`                  | `missing` | 실행 전에 이미지 가져오기 (`always`, `missing`, `never`)                         |
| `-q --quiet`              |           | 가져오기 출력 억제                                                               |
| `--read-only`             |           | 컨테이너의 루트 파일 시스템을 읽기 전용으로 마운트                               |
| `--restart`               | `no`      | 컨테이너가 종료될 때 적용할 재시작 정책                                          |
| `--rm`                    |           | 컨테이너가 종료되면 자동으로 컨테이너와 관련된 익명 볼륨 제거<br />              |
| `--runtime`               |           | 이 컨테이너에 사용할 런타임                                                      |
| `--security-opt`          |           | 보안 옵션                                                                        |
| `--shm-size`              |           | /dev/shm의 크기                                                                  |
| `--sig-proxy`             | `true`    | 수신된 신호를 프로세스에 프록시                                                  |
| `--stop-signal`           |           | 컨테이너를 중지할 신호                                                           |
| `--stop-timeout`          |           | 컨테이너를 중지할 시간 초과 (초 단위)                                            |
| `--storage-opt`           |           | 컨테이너의 스토리지 드라이버 옵션                                                |
| `--sysctl`                |           | Sysctl 옵션                                                                      |
| `--tmpfs`                 |           | tmpfs 디렉토리 마운트                                                            |
| `-t --tty`                |           | 가상 터미널 할당                                                                 |
| `--ulimit`                |           | Ulimit 옵션                                                                      |
| `-u --user`               |           | 사용자 이름 또는 UID (형식: \<name\|uid\>[:\<group\|gid\>])                      |
| `--userns`                |           | 사용할 사용자 네임스페이스                                                       |
| `--uts`                   |           | 사용할 UTS 네임스페이스                                                          |
| `-v --volume`             |           | 볼륨 바인드 마운트                                                               |
| `--volume-driver`         |           | 컨테이너의 선택적 볼륨 드라이버                                                  |
| `--volumes-from`          |           | 지정된 컨테이너에서 볼륨 마운트                                                  |
| `-w --workdir`            |           | 컨테이너 내부의 작업 디렉토리                                                    |

---

## 예제 {#examples}

### 이름 할당 (--name) {#name}

`--name` 플래그를 사용하면 컨테이너에 사용자 정의 식별자를 지정할 수 있습니다. 다음 예제는 `nginx:alpine` 이미지를 사용하여 `test`라는 이름의 컨테이너를 [백그라운드 모드](#detach)로 실행합니다.

```console
$ docker run --name test -d nginx:alpine
4bed76d3ad428b889c56c1ecc2bf2ed95cb08256db22dc5ef5863e1d03252a19
$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS                  PORTS     NAMES
4bed76d3ad42   nginx:alpine   "/docker-entrypoint.…"   1 second ago   Up Less than a second   80/tcp    test
```

다른 명령어에서 이름으로 컨테이너를 참조할 수 있습니다. 예를 들어, 다음 명령어는 `test`라는 이름의 컨테이너를 중지하고 제거합니다:

```console
$ docker stop test
test
$ docker rm test
test
```

`--name` 플래그를 사용하여 사용자 정의 이름을 지정하지 않으면 데몬이 `vibrant_cannon`과 같은 무작위로 생성된 이름을 컨테이너에 할당합니다. 사용자 정의 이름을 사용하면 컨테이너에 대해 기억하기 쉬운 ID를 가질 수 있는 이점이 있습니다.

또한, 컨테이너를 사용자 정의 브리지 네트워크에 연결하면 동일한 네트워크의 다른 컨테이너가 DNS를 통해 이름으로 컨테이너를 참조할 수 있습니다.

```console
$ docker network create mynet
cb79f45948d87e389e12013fa4d969689ed2c3316985dd832a43aaec9a0fe394
$ docker run --name test --net mynet -d nginx:alpine
58df6ecfbc2ad7c42d088ed028d367f9e22a5f834d7c74c66c0ab0485626c32a
$ docker run --net mynet busybox:latest ping test
PING test (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.073 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.411 ms
64 bytes from 172.18.0.2: seq=2 ttl=64 time=0.319 ms
64 bytes from 172.18.0.2: seq=3 ttl=64 time=0.383 ms
...
```

### 컨테이너 ID 캡처 (--cidfile) {#cidfile}

자동화를 돕기 위해 Docker가 컨테이너 ID를 선택한 파일에 기록하도록 할 수 있습니다. 이는 일부 프로그램이 프로세스 ID를 파일에 기록하는 것과 유사합니다 (PID 파일로 알려져 있음):

```console
$ docker run --cidfile /tmp/docker_test.cid ubuntu echo "test"
```

이는 컨테이너를 생성하고 콘솔에 `test`를 출력합니다. `cidfile` 플래그는 Docker가 새 파일을 생성하고 컨테이너 ID를 기록하도록 합니다. 파일이 이미 존재하면 Docker는 오류를 반환합니다. Docker는 `docker run`이 종료될 때 이 파일을 닫습니다.

### PID 설정 (--pid) {#pid}

```text
--pid=""  : 컨테이너의 PID (프로세스) 네임스페이스 모드 설정,
             'container:<name|id>': 다른 컨테이너의 PID 네임스페이스에 조인
             'host': 호스트의 PID 네임스페이스를 컨테이너 내부에서 사용
```

기본적으로 모든 컨테이너는 PID 네임스페이스가 활성화되어 있습니다.

PID 네임스페이스는 프로세스의 분리를 제공합니다. PID 네임스페이스는 시스템 프로세스의 보기를 제거하고 PID 1을 포함한 프로세스 ID를 재사용할 수 있게 합니다.

특정 경우에는 컨테이너가 호스트의 프로세스 네임스페이스를 공유하도록 하여 컨테이너 내의 프로세스가 시스템의 모든 프로세스를 볼 수 있도록 할 수 있습니다. 예를 들어, `strace` 또는 `gdb`와 같은 디버깅 도구를 포함한 컨테이너를 빌드할 수 있지만, 이러한 도구를 사용하여 컨테이너 내의 프로세스를 디버깅하고자 할 수 있습니다.

#### 예제: 컨테이너 내에서 htop 실행

호스트의 프로세스 네임스페이스를 공유하는 컨테이너에서 `htop`을 실행하려면:

1. `--pid=host` 옵션을 사용하여 알파인 컨테이너를 실행합니다:

   ```console
   $ docker run --rm -it --pid=host alpine
   ```

2. 컨테이너에 `htop`을 설치합니다:

   ```console
   / # apk add --quiet htop
   ```

3. `htop` 명령을 실행합니다.

   ```console
   / # htop
   ```

#### Example, join another container's PID namespace

Joining another container's PID namespace can be useful for debugging that
container.

1. Start a container running a Redis server:

   ```console
   $ docker run --rm --name my-nginx -d nginx:alpine
   ```

2. Run an Alpine container that attaches the `--pid` namespace to the
   `my-nginx` container:

   ```console
   $ docker run --rm -it --pid=container:my-nginx \
     --cap-add SYS_PTRACE \
     --security-opt seccomp=unconfined \
     alpine
   ```

3. Install `strace` in the Alpine container:

   ```console
   / # apk add strace
   ```

4. Attach to process 1, the process ID of the `my-nginx` container:

   ```console
   / # strace -p 1
   strace: Process 1 attached
   ```

### Disable namespace remapping for a container (--userns) {#userns}

If you enable user namespaces on the daemon,
all containers are started with user namespaces enabled by default.
To disable user namespace remapping for a specific container,
you can set the `--userns` flag to `host`.

```console
docker run --userns=host hello-world
```

`host` is the only valid value for the `--userns` flag.

For more information, refer to [Isolate containers with a user namespace](/engine/security/userns-remap/).

### UTS settings (--uts) {#uts}

```text
--uts=""  : Set the UTS namespace mode for the container
            'host': use the host's UTS namespace inside the container
```

The UTS namespace is for setting the hostname and the domain that's visible to
running processes in that namespace. By default, all containers, including
those with `--network=host`, have their own UTS namespace. Setting `--uts` to
`host` results in the container using the same UTS namespace as the host.

> [!NOTE]
> Docker disallows combining the `--hostname` and `--domainname` flags with
> `--uts=host`. This is to prevent containers running in the host's UTS
> namespace from attempting to change the hosts' configuration.

You may wish to share the UTS namespace with the host if you would like the
hostname of the container to change as the hostname of the host changes. A more
advanced use case would be changing the host's hostname from a container.

### IPC settings (--ipc) {#ipc}

```text
--ipc="MODE"  : Set the IPC mode for the container
```

The `--ipc` flag accepts the following values:

| Value                        | Description                                                                      |
| :--------------------------- | :------------------------------------------------------------------------------- |
| ""                           | Use daemon's default.                                                            |
| "none"                       | Own private IPC namespace, with /dev/shm not mounted.                            |
| "private"                    | Own private IPC namespace.                                                       |
| "shareable"                  | Own private IPC namespace, with a possibility to share it with other containers. |
| "container:\<_name-or-ID_\>" | Join another ("shareable") container's IPC namespace.                            |
| "host"                       | Use the host system's IPC namespace.                                             |

If not specified, daemon default is used, which can either be `"private"`
or `"shareable"`, depending on the daemon version and configuration.

[System V interprocess communication (IPC)](https://linux.die.net/man/5/ipc)
namespaces provide separation of named shared memory segments, semaphores and
message queues.

Shared memory segments are used to accelerate inter-process communication at
memory speed, rather than through pipes or through the network stack. Shared
memory is commonly used by databases and custom-built (typically C/OpenMPI,
C++/using boost libraries) high performance applications for scientific
computing and financial services industries. If these types of applications
are broken into multiple containers, you might need to share the IPC mechanisms
of the containers, using `"shareable"` mode for the main (i.e. "donor")
container, and `"container:<donor-name-or-ID>"` for other containers.

### Escalate container privileges (--privileged) {#privileged}

The `--privileged` flag gives the following capabilities to a container:

- Enables all Linux kernel capabilities
- Disables the default seccomp profile
- Disables the default AppArmor profile
- Disables the SELinux process label
- Grants access to all host devices
- Makes `/sys` read-write
- Makes cgroups mounts read-write

In other words, the container can then do almost everything that the host can
do. This flag exists to allow special use-cases, like running Docker within
Docker.

:::warning
Use the `--privileged` flag with caution.
A container with `--privileged` is not a securely sandboxed process.
Containers in this mode can get a root shell on the host
and take control over the system.

For most use cases, this flag should not be the preferred solution.
If your container requires escalated privileges,
you should prefer to explicitly grant the necessary permissions,
for example by adding individual kernel capabilities with `--cap-add`.

For more information, see
[Runtime privilege and Linux capabilities](/engine/containers/run/#runtime-privilege-and-linux-capabilities)
:::

The following example doesn't work, because by default, Docker drops most
potentially dangerous kernel capabilities, including `CAP_SYS_ADMIN ` (which is
required to mount filesystems).

```console
$ docker run -t -i --rm ubuntu bash
root@bc338942ef20:/# mount -t tmpfs none /mnt
mount: permission denied
```

It works when you add the `--privileged` flag:

```console
$ docker run -t -i --privileged ubuntu bash
root@50e3f57e16e6:/# mount -t tmpfs none /mnt
root@50e3f57e16e6:/# df -h
Filesystem      Size  Used Avail Use% Mounted on
none            1.9G     0  1.9G   0% /mnt
```

### Set working directory (-w, --workdir) {#workdir}

```console
$ docker run -w /path/to/dir/ -i -t ubuntu pwd
```

The `-w` option runs the command executed inside the directory specified, in this example,
`/path/to/dir/`. If the path doesn't exist, Docker creates it inside the container.

### Set storage driver options per container (--storage-opt) {#storage-opt}

```console
$ docker run -it --storage-opt size=120G fedora /bin/bash
```

This (size) constraints the container filesystem size to 120G at creation time.
This option is only available for the `btrfs`, `overlay2`, `windowsfilter`,
and `zfs` storage drivers.

For the `overlay2` storage driver, the size option is only available if the
backing filesystem is `xfs` and mounted with the `pquota` mount option.
Under these conditions, you can pass any size less than the backing filesystem size.

For the `windowsfilter`, `btrfs`, and `zfs` storage drivers, you cannot pass a
size less than the Default BaseFS Size.

### Mount tmpfs (--tmpfs) {#tmpfs}

The `--tmpfs` flag lets you create a `tmpfs` mount.

The options that you can pass to `--tmpfs` are identical to the Linux `mount -t
tmpfs -o` command. The following example mounts an empty `tmpfs` into the
container with the `rw`, `noexec`, `nosuid`, `size=65536k` options.

```console
$ docker run -d --tmpfs /run:rw,noexec,nosuid,size=65536k my_image
```

For more information, see [tmpfs mounts](/storage/tmpfs/).

### Mount volume (-v) {#volume}

```console
$ docker  run  -v $(pwd):$(pwd) -w $(pwd) -i -t  ubuntu pwd
```

The example above mounts the current directory into the container at the same path
using the `-v` flag, sets it as the working directory, and then runs the `pwd` command inside the container.

As of Docker Engine version 23, you can use relative paths on the host.

```console
$ docker  run  -v ./content:/content -w /content -i -t  ubuntu pwd
```

The example above mounts the `content` directory in the current directory into the container at the
`/content` path using the `-v` flag, sets it as the working directory, and then
runs the `pwd` command inside the container.

```console
$ docker run -v /doesnt/exist:/foo -w /foo -i -t ubuntu bash
```

When the host directory of a bind-mounted volume doesn't exist, Docker
automatically creates this directory on the host for you. In the
example above, Docker creates the `/doesnt/exist`
folder before starting your container.

### Mount volume read-only (--read-only) {#read-only}

```console
$ docker run --read-only -v /icanwrite busybox touch /icanwrite/here
```

You can use volumes in combination with the `--read-only` flag to control where
a container writes files. The `--read-only` flag mounts the container's root
filesystem as read only prohibiting writes to locations other than the
specified volumes for the container.

```console
$ docker run -t -i -v /var/run/docker.sock:/var/run/docker.sock -v /path/to/static-docker-binary:/usr/bin/docker busybox sh
```

By bind-mounting the Docker Unix socket and statically linked Docker
binary (refer to [get the Linux binary](/engine/install/binaries/#install-static-binaries)),
you give the container the full access to create and manipulate the host's
Docker daemon.

On Windows, you must specify the paths using Windows-style path semantics.

```powershell
PS C:\> docker run -v c:\foo:c:\dest microsoft/nanoserver cmd /s /c type c:\dest\somefile.txt
Contents of file

PS C:\> docker run -v c:\foo:d: microsoft/nanoserver cmd /s /c type d:\somefile.txt
Contents of file
```

The following examples fails when using Windows-based containers, as the
destination of a volume or bind mount inside the container must be one of:
a non-existing or empty directory; or a drive other than `C:`. Further, the source
of a bind mount must be a local directory, not a file.

```powershell
net use z: \\remotemachine\share
docker run -v z:\foo:c:\dest ...
docker run -v \\uncpath\to\directory:c:\dest ...
docker run -v c:\foo\somefile.txt:c:\dest ...
docker run -v c:\foo:c: ...
docker run -v c:\foo:c:\existing-directory-with-contents ...
```

For in-depth information about volumes, refer to [manage data in containers](/storage/volumes/)

### Add bind mounts or volumes using the --mount flag {#mount}

The `--mount` flag allows you to mount volumes, host-directories, and `tmpfs`
mounts in a container.

The `--mount` flag supports most options supported by the `-v` or the
`--volume` flag, but uses a different syntax. For in-depth information on the
`--mount` flag, and a comparison between `--volume` and `--mount`, refer to
[Bind mounts](/storage/bind-mounts/).

Even though there is no plan to deprecate `--volume`, usage of `--mount` is recommended.

Examples:

```console
$ docker run --read-only --mount type=volume,target=/icanwrite busybox touch /icanwrite/here
```

```console
$ docker run -t -i --mount type=bind,src=/data,dst=/data busybox sh
```

### Publish or expose port (-p, --expose) {#publish}

```console
$ docker run -p 127.0.0.1:80:8080/tcp nginx:alpine
```

This binds port `8080` of the container to TCP port `80` on `127.0.0.1` of the
host. You can also specify `udp` and `sctp` ports. The [Networking overview
page](/network/) explains in detail how to publish ports
with Docker.

> [!NOTE]
> If you don't specify an IP address (i.e., `-p 80:80` instead of `-p
127.0.0.1:80:80`) when publishing a container's ports, Docker publishes the
> port on all interfaces (address `0.0.0.0`) by default. These ports are
> externally accessible. This also applies if you configured UFW to block this
> specific port, as Docker manages its own iptables rules. [Read
> more](/network/packet-filtering-firewalls/)

```console
$ docker run --expose 80 nginx:alpine
```

This exposes port `80` of the container without publishing the port to the host
system's interfaces.

### Publish all exposed ports (-P, --publish-all) {#publish-all}

```console
$ docker run -P nginx:alpine
```

The `-P`, or `--publish-all`, flag publishes all the exposed ports to the host.
Docker binds each exposed port to a random port on the host.

The `-P` flag only publishes port numbers that are explicitly flagged as
exposed, either using the Dockerfile `EXPOSE` instruction or the `--expose`
flag for the `docker run` command.

The range of ports are within an _ephemeral port range_ defined by
`/proc/sys/net/ipv4/ip_local_port_range`. Use the `-p` flag to explicitly map a
single port or range of ports.

### Set the pull policy (--pull) {#pull}

Use the `--pull` flag to set the image pull policy when creating (and running)
the container.

The `--pull` flag can take one of these values:

| Value               | Description                                                                                                       |
| :------------------ | :---------------------------------------------------------------------------------------------------------------- |
| `missing` (default) | Pull the image if it was not found in the image cache, or use the cached image otherwise.                         |
| `never`             | Do not pull the image, even if it's missing, and produce an error if the image does not exist in the image cache. |
| `always`            | Always perform a pull before creating the container.                                                              |

When creating (and running) a container from an image, the daemon checks if the
image exists in the local image cache. If the image is missing, an error is
returned to the CLI, allowing it to initiate a pull.

The default (`missing`) is to only pull the image if it's not present in the
daemon's image cache. This default allows you to run images that only exist
locally (for example, images you built from a Dockerfile, but that have not
been pushed to a registry), and reduces networking.

The `always` option always initiates a pull before creating the container. This
option makes sure the image is up-to-date, and prevents you from using outdated
images, but may not be suitable in situations where you want to test a locally
built image before pushing (as pulling the image overwrites the existing image
in the image cache).

The `never` option disables (implicit) pulling images when creating containers,
and only uses images that are available in the image cache. If the specified
image is not found, an error is produced, and the container is not created.
This option is useful in situations where networking is not available, or to
prevent images from being pulled implicitly when creating containers.

The following example shows `docker run` with the `--pull=never` option set,
which produces en error as the image is missing in the image-cache:

```console
$ docker run --pull=never hello-world
docker: Error response from daemon: No such image: hello-world:latest.
```

### Set environment variables (-e, --env, --env-file) {#env}

```console
$ docker run -e MYVAR1 --env MYVAR2=foo --env-file ./env.list ubuntu bash
```

Use the `-e`, `--env`, and `--env-file` flags to set simple (non-array)
environment variables in the container you're running, or overwrite variables
defined in the Dockerfile of the image you're running.

You can define the variable and its value when running the container:

```console
$ docker run --env VAR1=value1 --env VAR2=value2 ubuntu env | grep VAR
VAR1=value1
VAR2=value2
```

You can also use variables exported to your local environment:

```console
export VAR1=value1
export VAR2=value2

$ docker run --env VAR1 --env VAR2 ubuntu env | grep VAR
VAR1=value1
VAR2=value2
```

When running the command, the Docker CLI client checks the value the variable
has in your local environment and passes it to the container.
If no `=` is provided and that variable isn't exported in your local
environment, the variable is unset in the container.

You can also load the environment variables from a file. This file should use
the syntax `<variable>=value` (which sets the variable to the given value) or
`<variable>` (which takes the value from the local environment), and `#` for
comments. Lines beginning with `#` are treated as line comments and are
ignored, whereas a `#` appearing anywhere else in a line is treated as part of
the variable value.

```console
$ cat env.list
# This is a comment
VAR1=value1
VAR2=value2
USER

$ docker run --env-file env.list ubuntu env | grep -E 'VAR|USER'
VAR1=value1
VAR2=value2
USER=jonzeolla
```

### Set metadata on container (-l, --label, --label-file) {#label}

A label is a `key=value` pair that applies metadata to a container. To label a container with two labels:

```console
$ docker run -l my-label --label com.example.foo=bar ubuntu bash
```

The `my-label` key doesn't specify a value so the label defaults to an empty
string (`""`). To add multiple labels, repeat the label flag (`-l` or `--label`).

The `key=value` must be unique to avoid overwriting the label value. If you
specify labels with identical keys but different values, each subsequent value
overwrites the previous. Docker uses the last `key=value` you supply.

Use the `--label-file` flag to load multiple labels from a file. Delimit each
label in the file with an EOL mark. The example below loads labels from a
labels file in the current directory:

```console
$ docker run --label-file ./labels ubuntu bash
```

The label-file format is similar to the format for loading environment
variables. (Unlike environment variables, labels are not visible to processes
running inside a container.) The following example shows a label-file
format:

```console
com.example.label1="a label"

# this is a comment
com.example.label2=another\ label
com.example.label3
```

You can load multiple label-files by supplying multiple `--label-file` flags.

For additional information on working with labels, see
[Labels](/config/labels-custom-metadata/).

### Connect a container to a network (--network) {#network}

To start a container and connect it to a network, use the `--network` option.

If you want to add a running container to a network use the `docker network connect` subcommand.

You can connect multiple containers to the same network. Once connected, the
containers can communicate using only another container's IP address
or name. For `overlay` networks or custom plugins that support multi-host
connectivity, containers connected to the same multi-host network but launched
from different Engines can also communicate in this way.

> [!NOTE]
> The default bridge network only allows containers to communicate with each other using
> internal IP addresses. User-created bridge networks provide DNS resolution between
> containers using container names.

You can disconnect a container from a network using the `docker network
disconnect` command.

The following commands create a network named `my-net` and add a `busybox` container
to the `my-net` network.

```console
$ docker network create my-net
$ docker run -itd --network=my-net busybox
```

You can also choose the IP addresses for the container with `--ip` and `--ip6`
flags when you start the container on a user-defined network. To assign a
static IP to containers, you must specify subnet block for the network.

```console
$ docker network create --subnet 192.0.2.0/24 my-net
$ docker run -itd --network=my-net --ip=192.0.2.69 busybox
```

To connect the container to more than one network, repeat the `--network` option.

```console
$ docker network create --subnet 192.0.2.0/24 my-net1
$ docker network create --subnet 192.0.3.0/24 my-net2
$ docker run -itd --network=my-net1 --network=my-net2 busybox
```

To specify options when connecting to more than one network, use the extended syntax
for the `--network` flag. Comma-separated options that can be specified in the extended
`--network` syntax are:

| Option          | Top-level Equivalent                  | Description                                     |
| --------------- | ------------------------------------- | ----------------------------------------------- |
| `name`          |                                       | The name of the network (mandatory)             |
| `alias`         | `--network-alias`                     | Add network-scoped alias for the container      |
| `ip`            | `--ip`                                | IPv4 address (e.g., 172.30.100.104)             |
| `ip6`           | `--ip6`                               | IPv6 address (e.g., 2001:db8::33)               |
| `mac-address`   | `--mac-address`                       | Container MAC address (e.g., 92:d0:c6:0a:29:33) |
| `link-local-ip` | `--link-local-ip`                     | Container IPv4/IPv6 link-local addresses        |
| `driver-opt`    | `docker network connect --driver-opt` | Network driver options                          |

```console
$ docker network create --subnet 192.0.2.0/24 my-net1
$ docker network create --subnet 192.0.3.0/24 my-net2
$ docker run -itd --network=name=my-net1,ip=192.0.2.42 --network=name=my-net2,ip=192.0.3.42 busybox
```

`sysctl` settings that start with `net.ipv4.`, `net.ipv6.` or `net.mpls.` can be
set per-interface using `driver-opt` label `com.docker.network.endpoint.sysctls`.
The interface name must be the string `IFNAME`.

To set more than one `sysctl` for an interface, quote the whole `driver-opt` field,
remembering to escape the quotes for the shell if necessary. For example, if the
interface to `my-net` is given name `eth0`, the following example sets sysctls
`net.ipv4.conf.eth0.log_martians=1` and `net.ipv4.conf.eth0.forwarding=0`, and
assigns the IPv4 address `192.0.2.42`.

```console
$ docker network create --subnet 192.0.2.0/24 my-net
$ docker run -itd --network=name=my-net,\"driver-opt=com.docker.network.endpoint.sysctls=net.ipv4.conf.IFNAME.log_martians=1,net.ipv4.conf.IFNAME.forwarding=0\",ip=192.0.2.42 busybox
```

> [!NOTE]
> Network drivers may restrict the sysctl settings that can be modified and, to protect
> the operation of the network, new restrictions may be added in the future.

For more information on connecting a container to a network when using the `run` command,
see the [Docker network overview](/network/).

### Mount volumes from container (--volumes-from) {#volumes-from}

```console
$ docker run --volumes-from 777f7dc92da7 --volumes-from ba8c0c54f0f2:ro -i -t ubuntu pwd
```

The `--volumes-from` flag mounts all the defined volumes from the referenced
containers. You can specify more than one container by repetitions of the `--volumes-from`
argument. The container ID may be optionally suffixed with `:ro` or `:rw` to
mount the volumes in read-only or read-write mode, respectively. By default,
Docker mounts the volumes in the same mode (read write or read only) as
the reference container.

Labeling systems like SELinux require placing proper labels on volume
content mounted into a container. Without a label, the security system might
prevent the processes running inside the container from using the content. By
default, Docker does not change the labels set by the OS.

To change the label in the container context, you can add either of two suffixes
`:z` or `:Z` to the volume mount. These suffixes tell Docker to relabel file
objects on the shared volumes. The `z` option tells Docker that two containers
share the volume content. As a result, Docker labels the content with a shared
content label. Shared volume labels allow all containers to read/write content.
The `Z` option tells Docker to label the content with a private unshared label.
Only the current container can use a private volume.

### Detached mode (-d, --detach) {#detach}

The `--detach` (or `-d`) flag starts a container as a background process that
doesn't occupy your terminal window. By design, containers started in detached
mode exit when the root process used to run the container exits, unless you
also specify the `--rm` option. If you use `-d` with `--rm`, the container is
removed when it exits or when the daemon exits, whichever happens first.

Don't pass a `service x start` command to a detached container. For example,
this command attempts to start the `nginx` service.

```console
$ docker run -d -p 80:80 my_image service nginx start
```

This succeeds in starting the `nginx` service inside the container. However, it
fails the detached container paradigm in that, the root process (`service nginx
start`) returns and the detached container stops as designed. As a result, the
`nginx` service starts but can't be used. Instead, to start a process such as
the `nginx` web server do the following:

```console
$ docker run -d -p 80:80 my_image nginx -g 'daemon off;'
```

To do input/output with a detached container use network connections or shared
volumes. These are required because the container is no longer listening to the
command line where `docker run` was run.

### Override the detach sequence (--detach-keys) {#detach-keys}

Use the `--detach-keys` option to override the Docker key sequence for detach.
This is useful if the Docker default sequence conflicts with key sequence you
use for other applications. There are two ways to define your own detach key
sequence, as a per-container override or as a configuration property on your
entire configuration.

To override the sequence for an individual container, use the
`--detach-keys="<sequence>"` flag with the `docker attach` command. The format of
the `<sequence>` is either a letter [a-Z], or the `ctrl-` combined with any of
the following:

- `a-z` (a single lowercase alpha character )
- `@` (at sign)
- `[` (left bracket)
- `\\` (two backward slashes)
- `_` (underscore)
- `^` (caret)

These `a`, `ctrl-a`, `X`, or `ctrl-\\` values are all examples of valid key
sequences. To configure a different configuration default key sequence for all
containers, see [**Configuration file** section](/reference/cli/docker/#configuration-files).

### Add host device to container (--device) {#device}

```console
$ docker run -it --rm \
    --device=/dev/sdc:/dev/xvdc \
    --device=/dev/sdd \
    --device=/dev/zero:/dev/foobar \
    ubuntu ls -l /dev/{xvdc,sdd,foobar}

brw-rw---- 1 root disk 8, 2 Feb  9 16:05 /dev/xvdc
brw-rw---- 1 root disk 8, 3 Feb  9 16:05 /dev/sdd
crw-rw-rw- 1 root root 1, 5 Feb  9 16:05 /dev/foobar
```

It's often necessary to directly expose devices to a container. The `--device`
option enables that. For example, adding a specific block storage device or loop
device or audio device to an otherwise unprivileged container
(without the `--privileged` flag) and have the application directly access it.

By default, the container is able to `read`, `write` and `mknod` these devices.
This can be overridden using a third `:rwm` set of options to each `--device`
flag. If the container is running in privileged mode, then Docker ignores the
specified permissions.

```console
$ docker run --device=/dev/sda:/dev/xvdc --rm -it ubuntu fdisk  /dev/xvdc

Command (m for help): q
$ docker run --device=/dev/sda:/dev/xvdc:r --rm -it ubuntu fdisk  /dev/xvdc
You will not be able to write the partition table.

Command (m for help): q

$ docker run --device=/dev/sda:/dev/xvdc:rw --rm -it ubuntu fdisk  /dev/xvdc

Command (m for help): q

$ docker run --device=/dev/sda:/dev/xvdc:m --rm -it ubuntu fdisk  /dev/xvdc
fdisk: unable to open /dev/xvdc: Operation not permitted
```

> [!NOTE]
> The `--device` option cannot be safely used with ephemeral devices. You shouldn't
> add block devices that may be removed to untrusted containers with `--device`.

For Windows, the format of the string passed to the `--device` option is in
the form of `--device=<IdType>/<Id>`. Beginning with Windows Server 2019
and Windows 10 October 2018 Update, Windows only supports an IdType of
`class` and the Id as a [device interface class
GUID](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/overview-of-device-interface-classes).
Refer to the table defined in the [Windows container
docs](https://docs.microsoft.com/en-us/virtualization/windowscontainers/deploy-containers/hardware-devices-in-containers)
for a list of container-supported device interface class GUIDs.

If you specify this option for a process-isolated Windows container, Docker makes
_all_ devices that implement the requested device interface class GUID
available in the container. For example, the command below makes all COM
ports on the host visible in the container.

```powershell
PS C:\> docker run --device=class/86E0D1E0-8089-11D0-9CE4-08003E301F73 mcr.microsoft.com/windows/servercore:ltsc2019
```

> [!NOTE]
> The `--device` option is only supported on process-isolated Windows containers,
> and produces an error if the container isolation is `hyperv`.

#### CDI devices

> [!NOTE]
> The CDI feature is experimental, and potentially subject to change.
> CDI is currently only supported for Linux containers.

[Container Device Interface
(CDI)](https://github.com/cncf-tags/container-device-interface/blob/main/SPEC.md)
is a standardized mechanism for container runtimes to create containers which
are able to interact with third party devices.

With CDI, device configurations are declaratively defined using a JSON or YAML
file. In addition to enabling the container to interact with the device node,
it also lets you specify additional configuration for the device, such as
environment variables, host mounts (such as shared objects), and executable
hooks.

You can reference a CDI device with the `--device` flag using the
fully-qualified name of the device, as shown in the following example:

```console
$ docker run --device=vendor.com/class=device-name --rm -it ubuntu
```

This starts an `ubuntu` container with access to the specified CDI device,
`vendor.com/class=device-name`, assuming that:

- A valid CDI specification (JSON or YAML file) for the requested device is
  available on the system running the daemon, in one of the configured CDI
  specification directories.
- The CDI feature has been enabled in the daemon; see [Enable CDI
  devices](/reference/cli/dockerd/#enable-cdi-devices).

### Attach to STDIN/STDOUT/STDERR (-a, --attach) {#attach}

The `--attach` (or `-a`) flag tells `docker run` to bind to the container's
`STDIN`, `STDOUT` or `STDERR`. This makes it possible to manipulate the output
and input as needed. You can specify to which of the three standard streams
(`STDIN`, `STDOUT`, `STDERR`) you'd like to connect instead, as in:

```console
$ docker run -a stdin -a stdout -i -t ubuntu /bin/bash
```

The following example pipes data into a container and prints the container's ID
by attaching only to the container's `STDIN`.

```console
$ echo "test" | docker run -i -a stdin ubuntu cat -
```

The following example doesn't print anything to the console unless there's an
error because output is only attached to the `STDERR` of the container. The
container's logs still store what's written to `STDERR` and `STDOUT`.

```console
$ docker run -a stderr ubuntu echo test
```

The following example shows a way of using `--attach` to pipe a file into a
container. The command prints the container's ID after the build completes and
you can retrieve the build logs using `docker logs`. This is useful if you need
to pipe a file or something else into a container and retrieve the container's
ID once the container has finished running.

```console
$ cat somefile | docker run -i -a stdin mybuilder dobuild
```

> [!NOTE]
> A process running as PID 1 inside a container is treated specially by
> Linux: it ignores any signal with the default action. So, the process
> doesn't terminate on `SIGINT` or `SIGTERM` unless it's coded to do so.

See also [the `docker cp` command](/reference/cli/docker/container/cp/).

### Keep STDIN open (-i, --interactive) {#interactive}

The `--interactive` (or `-i`) flag keeps the container's `STDIN` open, and lets
you send input to the container through standard input.

```console
$ echo hello | docker run --rm -i busybox cat
hello
```

The `-i` flag is most often used together with the `--tty` flag to bind the I/O
streams of the container to a pseudo terminal, creating an interactive terminal
session for the container. See [Allocate a pseudo-TTY](#tty) for more examples.

```console
$ docker run -it debian
root@10a3e71492b0:/# factor 90
90: 2 3 3 5
root@10a3e71492b0:/# exit
exit
```

Using the `-i` flag on its own allows for composition, such as piping input to
containers:

```console
$ docker run --rm -i busybox echo "foo bar baz" \
  | docker run --rm -i busybox awk '{ print $2 }' \
  | docker run --rm -i busybox rev
rab
```

### Specify an init process {#init}

You can use the `--init` flag to indicate that an init process should be used as
the PID 1 in the container. Specifying an init process ensures the usual
responsibilities of an init system, such as reaping zombie processes, are
performed inside the created container.

The default init process used is the first `docker-init` executable found in the
system path of the Docker daemon process. This `docker-init` binary, included in
the default installation, is backed by [tini](https://github.com/krallin/tini).

### Allocate a pseudo-TTY (-t, --tty) {#tty}

The `--tty` (or `-t`) flag attaches a pseudo-TTY to the container, connecting
your terminal to the I/O streams of the container. Allocating a pseudo-TTY to
the container means that you get access to input and output feature that TTY
devices provide.

For example, the following command runs the `passwd` command in a `debian`
container, to set a new password for the `root` user.

```console
$ docker run -i debian passwd root
New password: karjalanpiirakka9
Retype new password: karjalanpiirakka9
passwd: password updated successfully
```

If you run this command with only the `-i` flag (which lets you send text to
`STDIN` of the container), the `passwd` prompt displays the password in plain
text. However, if you try the same thing but also adding the `-t` flag, the
password is hidden:

```console
$ docker run -it debian passwd root
New password:
Retype new password:
passwd: password updated successfully
```

This is because `passwd` can suppress the output of characters to the terminal
using the echo-off TTY feature.

You can use the `-t` flag without `-i` flag. This still allocates a pseudo-TTY
to the container, but with no way of writing to `STDIN`. The only time this
might be useful is if the output of the container requires a TTY environment.

### Specify custom cgroups {#cgroup-parent}

Using the `--cgroup-parent` flag, you can pass a specific cgroup to run a
container in. This allows you to create and manage cgroups on their own. You can
define custom resources for those cgroups and put containers under a common
parent group.

### Using dynamically created devices (--device-cgroup-rule) {#device-cgroup-rule}

Docker assigns devices available to a container at creation time. The
assigned devices are added to the cgroup.allow file and
created into the container when it runs. This poses a problem when
you need to add a new device to running container.

One solution is to add a more permissive rule to a container
allowing it access to a wider range of devices. For example, supposing
the container needs access to a character device with major `42` and
any number of minor numbers (added as new devices appear), add the
following rule:

```console
$ docker run -d --device-cgroup-rule='c 42:* rmw' --name my-container my-image
```

Then, a user could ask `udev` to execute a script that would `docker exec my-container mknod newDevX c 42 <minor>`
the required device when it is added.

> [!NOTE]
> You still need to explicitly add initially present devices to the
> `docker run` / `docker create` command.

### Access an NVIDIA GPU {#gpus}

The `--gpus` flag allows you to access NVIDIA GPU resources. First you need to
install the [nvidia-container-runtime](https://nvidia.github.io/nvidia-container-runtime/).

> [!NOTE]
> You can also specify a GPU as a CDI device with the `--device` flag, see
> [CDI devices](#cdi-devices).

Read [Specify a container's resources](/config/containers/resource_constraints/)
for more information.

To use `--gpus`, specify which GPUs (or all) to use. If you provide no value, Docker uses all
available GPUs. The example below exposes all available GPUs.

```console
$ docker run -it --rm --gpus all ubuntu nvidia-smi
```

Use the `device` option to specify GPUs. The example below exposes a specific
GPU.

```console
$ docker run -it --rm --gpus device=GPU-3a23c669-1f69-c64e-cf85-44e9b07e7a2a ubuntu nvidia-smi
```

The example below exposes the first and third GPUs.

```console
$ docker run -it --rm --gpus '"device=0,2"' ubuntu nvidia-smi
```

### Restart policies (--restart) {#restart}

Use the `--restart` flag to specify a container's _restart policy_. A restart
policy controls whether the Docker daemon restarts a container after exit.
Docker supports the following restart policies:

| Flag                       | Description                                                                                                                                                                                                                                                                                                                                                           |
| :------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no`                       | Don't automatically restart the container. (Default)                                                                                                                                                                                                                                                                                                                  |
| `on-failure[:max-retries]` | Restart the container if it exits due to an error, which manifests as a non-zero exit code. Optionally, limit the number of times the Docker daemon attempts to restart the container using the `:max-retries` option. The `on-failure` policy only prompts a restart if the container exits with a failure. It doesn't restart the container if the daemon restarts. |
| `always`                   | Always restart the container if it stops. If it's manually stopped, it's restarted only when Docker daemon restarts or the container itself is manually restarted.                                                                                                                                                                                                    |
| `unless-stopped`           | Similar to `always`, except that when the container is stopped (manually or otherwise), it isn't restarted even after Docker daemon restarts.                                                                                                                                                                                                                         |

```console
$ docker run --restart=always redis
```

This runs the `redis` container with a restart policy of **always**.
If the container exits, Docker restarts it.

When a restart policy is active on a container, it shows as either `Up` or
`Restarting` in [`docker ps`](/reference/cli/docker/container/ls/). It can also be useful to use
[`docker events`](/reference/cli/docker/system/events/) to see the restart policy in effect.

An increasing delay (double the previous delay, starting at 100 milliseconds)
is added before each restart to prevent flooding the server. This means the
daemon waits for 100 ms, then 200 ms, 400, 800, 1600, and so on until either
the `on-failure` limit, the maximum delay of 1 minute is hit, or when you
`docker stop` or `docker rm -f` the container.

If a container is successfully restarted (the container is started and runs
for at least 10 seconds), the delay is reset to its default value of 100 ms.

#### Specify a limit for restart attempts

You can specify the maximum amount of times Docker attempts to restart the
container when using the **on-failure** policy. By default, Docker never stops
attempting to restart the container.

The following example runs the `redis` container with a restart policy of
**on-failure** and a maximum restart count of 10.

```console
$ docker run --restart=on-failure:10 redis
```

If the `redis` container exits with a non-zero exit status more than 10 times
in a row, Docker stops trying to restart the container. Providing a maximum
restart limit is only valid for the **on-failure** policy.

#### Inspect container restarts

The number of (attempted) restarts for a container can be obtained using the
[`docker inspect`](/reference/cli/docker/inspect/) command. For example, to get the number of
restarts for container "my-container";

```console
$ docker inspect -f "{{ .RestartCount }}" my-container
2
```

Or, to get the last time the container was (re)started;

```console
$ docker inspect -f "{{ .State.StartedAt }}" my-container
2015-03-04T23:47:07.691840179Z
```

Combining `--restart` (restart policy) with the `--rm` (clean up) flag results
in an error. On container restart, attached clients are disconnected.

### Clean up (--rm) {#rm}

By default, a container's file system persists even after the container exits.
This makes debugging a lot easier, since you can inspect the container's final
state and you retain all your data.

If you are running short-term **foreground** processes, these container file
systems can start to pile up. If you'd like Docker to automatically clean up
the container and remove the file system when the container exits, use the
`--rm` flag:

```text
--rm: Automatically remove the container when it exits
```

> [!NOTE]
> If you set the `--rm` flag, Docker also removes the anonymous volumes
> associated with the container when the container is removed. This is similar
> to running `docker rm -v my-container`. Only volumes that are specified
> without a name are removed. For example, when running the following command,
> volume `/foo` is removed, but not `/bar`:
>
> ```console
> $ docker run --rm -v /foo -v awesome:/bar busybox top
> ```
>
> Volumes inherited via `--volumes-from` are removed with the same logic:
> if the original volume was specified with a name it isn't removed.

### Add entries to container hosts file (--add-host) {#add-host}

You can add other hosts into a container's `/etc/hosts` file by using one or
more `--add-host` flags. This example adds a static address for a host named
`my-hostname`:

```console
$ docker run --add-host=my-hostname=8.8.8.8 --rm -it alpine

/ # ping my-hostname
PING my-hostname (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: seq=0 ttl=37 time=93.052 ms
64 bytes from 8.8.8.8: seq=1 ttl=37 time=92.467 ms
64 bytes from 8.8.8.8: seq=2 ttl=37 time=92.252 ms
^C
--- my-hostname ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max = 92.209/92.495/93.052 ms
```

You can wrap an IPv6 address in square brackets:

```console
$ docker run --add-host my-hostname=[2001:db8::33] --rm -it alpine
```

The `--add-host` flag supports a special `host-gateway` value that resolves to
the internal IP address of the host. This is useful when you want containers to
connect to services running on the host machine.

It's conventional to use `host.docker.internal` as the hostname referring to
`host-gateway`. Docker Desktop automatically resolves this hostname, see
[Explore networking features](/desktop/features/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host).

The following example shows how the special `host-gateway` value works. The
example runs an HTTP server that serves a file from host to container over the
`host.docker.internal` hostname, which resolves to the host's internal IP.

```console
$ echo "hello from host!" > ./hello
$ python3 -m http.server 8000
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
$ docker run \
  --add-host host.docker.internal=host-gateway \
  curlimages/curl -s host.docker.internal:8000/hello
hello from host!
```

The `--add-host` flag also accepts a `:` separator, for example:

```console
$ docker run --add-host=my-hostname:8.8.8.8 --rm -it alpine
```

### Logging drivers (--log-driver) {#log-driver}

The container can have a different logging driver than the Docker daemon. Use
the `--log-driver=<DRIVER>` with the `docker run` command to configure the
container's logging driver.

To learn about the supported logging drivers and how to use them, refer to
[Configure logging drivers](/engine/logging/configure/).

To disable logging for a container, set the `--log-driver` flag to `none`:

```console
$ docker run --log-driver=none -d nginx:alpine
5101d3b7fe931c27c2ba0e65fd989654d297393ad65ae238f20b97a020e7295b
$ docker logs 5101d3b
Error response from daemon: configured logging driver does not support reading
```

### Set ulimits in container (--ulimit) {#ulimit}

Since setting `ulimit` settings in a container requires extra privileges not
available in the default container, you can set these using the `--ulimit` flag.
Specify `--ulimit` with a soft and hard limit in the format
`<type>=<soft limit>[:<hard limit>]`. For example:

```console
$ docker run --ulimit nofile=1024:1024 --rm debian sh -c "ulimit -n"
1024
```

> [!NOTE]
> If you don't provide a hard limit value, Docker uses the soft limit value
> for both values. If you don't provide any values, they are inherited from
> the default `ulimits` set on the daemon.

> [!NOTE]
> The `as` option is deprecated.
> In other words, the following script is not supported:
>
> ```console
> $ docker run -it --ulimit as=1024 fedora /bin/bash
> ```

Docker sends the values to the appropriate OS `syscall` and doesn't perform any byte conversion.
Take this into account when setting the values.

#### For `nproc` usage

Be careful setting `nproc` with the `ulimit` flag as Linux uses `nproc` to set the
maximum number of processes available to a user, not to a container. For example, start four
containers with `daemon` user:

```console
$ docker run -d -u daemon --ulimit nproc=3 busybox top

$ docker run -d -u daemon --ulimit nproc=3 busybox top

$ docker run -d -u daemon --ulimit nproc=3 busybox top

$ docker run -d -u daemon --ulimit nproc=3 busybox top
```

The 4th container fails and reports a "[8] System error: resource temporarily unavailable" error.
This fails because the caller set `nproc=3` resulting in the first three containers using up
the three processes quota set for the `daemon` user.

### Stop container with signal (--stop-signal) {#stop-signal}

The `--stop-signal` flag sends the system call signal to the
container to exit. This signal can be a signal name in the format `SIG<NAME>`,
for instance `SIGKILL`, or an unsigned number that matches a position in the
kernel's syscall table, for instance `9`.

The default value is defined by [`STOPSIGNAL`](/reference/dockerfile/#stopsignal)
in the image, or `SIGTERM` if the image has no `STOPSIGNAL` defined.

### Optional security options (--security-opt) {#security-opt}

| Option                                    | Description                                                                                                                                                                                                      |
| :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--security-opt="label=user:USER"`        | Set the label user for the container                                                                                                                                                                             |
| `--security-opt="label=role:ROLE"`        | Set the label role for the container                                                                                                                                                                             |
| `--security-opt="label=type:TYPE"`        | Set the label type for the container                                                                                                                                                                             |
| `--security-opt="label=level:LEVEL"`      | Set the label level for the container                                                                                                                                                                            |
| `--security-opt="label=disable"`          | Turn off label confinement for the container                                                                                                                                                                     |
| `--security-opt="apparmor=PROFILE"`       | Set the apparmor profile to be applied to the container                                                                                                                                                          |
| `--security-opt="no-new-privileges=true"` | Disable container processes from gaining new privileges                                                                                                                                                          |
| `--security-opt="seccomp=unconfined"`     | Turn off seccomp confinement for the container                                                                                                                                                                   |
| `--security-opt="seccomp=builtin"`        | Use the default (built-in) seccomp profile for the container. This can be used to enable seccomp for a container running on a daemon with a custom default profile set, or with seccomp disabled ("unconfined"). |
| `--security-opt="seccomp=profile.json"`   | White-listed syscalls seccomp Json file to be used as a seccomp filter                                                                                                                                           |
| `--security-opt="systempaths=unconfined"` | Turn off confinement for system paths (masked paths, read-only paths) for the container                                                                                                                          |

The `--security-opt` flag lets you override the default labeling scheme for a
container. Specifying the level in the following command allows you to share
the same content between containers.

```console
$ docker run --security-opt label=level:s0:c100,c200 -it fedora bash
```

> [!NOTE]
> Automatic translation of MLS labels isn't supported.

To disable the security labeling for a container entirely, you can use
`label=disable`:

```console
$ docker run --security-opt label=disable -it ubuntu bash
```

If you want a tighter security policy on the processes within a container, you
can specify a custom `type` label. The following example runs a container
that's only allowed to listen on Apache ports:

```console
$ docker run --security-opt label=type:svirt_apache_t -it ubuntu bash
```

> [!NOTE]
> You would have to write policy defining a `svirt_apache_t` type.

To prevent your container processes from gaining additional privileges, you can
use the following command:

```console
$ docker run --security-opt no-new-privileges -it ubuntu bash
```

This means that commands that raise privileges such as `su` or `sudo` no longer work.
It also causes any seccomp filters to be applied later, after privileges have been dropped
which may mean you can have a more restrictive set of filters.
For more details, see the [kernel documentation](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt).

On Windows, you can use the `--security-opt` flag to specify the `credentialspec` option.
The `credentialspec` must be in the format `file://spec.txt` or `registry://keyname`.

### Stop container with timeout (--stop-timeout) {#stop-timeout}

The `--stop-timeout` flag sets the number of seconds to wait for the container
to stop after sending the pre-defined (see `--stop-signal`) system call signal.
If the container does not exit after the timeout elapses, it's forcibly killed
with a `SIGKILL` signal.

If you set `--stop-timeout` to `-1`, no timeout is applied, and the daemon
waits indefinitely for the container to exit.

The Daemon determines the default, and is 10 seconds for Linux containers,
and 30 seconds for Windows containers.

### Specify isolation technology for container (--isolation) {#isolation}

This option is useful in situations where you are running Docker containers on
Windows. The `--isolation=<value>` option sets a container's isolation technology.
On Linux, the only supported is the `default` option which uses Linux namespaces.
These two commands are equivalent on Linux:

```console
$ docker run -d busybox top
$ docker run -d --isolation default busybox top
```

On Windows, `--isolation` can take one of these values:

| Value     | Description                                                                                |
| :-------- | :----------------------------------------------------------------------------------------- |
| `default` | Use the value specified by the Docker daemon's `--exec-opt` or system default (see below). |
| `process` | Shared-kernel namespace isolation.                                                         |
| `hyperv`  | Hyper-V hypervisor partition-based isolation.                                              |

The default isolation on Windows server operating systems is `process`, and `hyperv`
on Windows client operating systems, such as Windows 10. Process isolation has better
performance, but requires that the image and host use the same kernel version.

On Windows server, assuming the default configuration, these commands are equivalent
and result in `process` isolation:

```powershell
PS C:\> docker run -d microsoft/nanoserver powershell echo process
PS C:\> docker run -d --isolation default microsoft/nanoserver powershell echo process
PS C:\> docker run -d --isolation process microsoft/nanoserver powershell echo process
```

If you have set the `--exec-opt isolation=hyperv` option on the Docker `daemon`, or
are running against a Windows client-based daemon, these commands are equivalent and
result in `hyperv` isolation:

```powershell
PS C:\> docker run -d microsoft/nanoserver powershell echo hyperv
PS C:\> docker run -d --isolation default microsoft/nanoserver powershell echo hyperv
PS C:\> docker run -d --isolation hyperv microsoft/nanoserver powershell echo hyperv
```

### Specify hard limits on memory available to containers (-m, --memory) {#memory}

These parameters always set an upper limit on the memory available to the container. Linux sets this
on the cgroup and applications in a container can query it at `/sys/fs/cgroup/memory/memory.limit_in_bytes`.

On Windows, this affects containers differently depending on what type of isolation you use.

- With `process` isolation, Windows reports the full memory of the host system, not the limit to applications running inside the container

  ```powershell
  PS C:\> docker run -it -m 2GB --isolation=process microsoft/nanoserver powershell Get-ComputerInfo *memory*

  CsTotalPhysicalMemory      : 17064509440
  CsPhyicallyInstalledMemory : 16777216
  OsTotalVisibleMemorySize   : 16664560
  OsFreePhysicalMemory       : 14646720
  OsTotalVirtualMemorySize   : 19154928
  OsFreeVirtualMemory        : 17197440
  OsInUseVirtualMemory       : 1957488
  OsMaxProcessMemorySize     : 137438953344
  ```

- With `hyperv` isolation, Windows creates a utility VM that is big enough to hold the memory limit, plus the minimal OS needed to host the container. That size is reported as "Total Physical Memory."

  ```powershell
  PS C:\> docker run -it -m 2GB --isolation=hyperv microsoft/nanoserver powershell Get-ComputerInfo *memory*

  CsTotalPhysicalMemory      : 2683355136
  CsPhyicallyInstalledMemory :
  OsTotalVisibleMemorySize   : 2620464
  OsFreePhysicalMemory       : 2306552
  OsTotalVirtualMemorySize   : 2620464
  OsFreeVirtualMemory        : 2356692
  OsInUseVirtualMemory       : 263772
  OsMaxProcessMemorySize     : 137438953344
  ```

### Configure namespaced kernel parameters (sysctls) at runtime (--sysctl) {#sysctl}

The `--sysctl` sets namespaced kernel parameters (sysctls) in the
container. For example, to turn on IP forwarding in the containers
network namespace, run this command:

```console
$ docker run --sysctl net.ipv4.ip_forward=1 someimage
```

> [!NOTE]
> Not all sysctls are namespaced. Docker does not support changing sysctls
> inside of a container that also modify the host system. As the kernel
> evolves we expect to see more sysctls become namespaced.

#### Currently supported sysctls

IPC Namespace:

- `kernel.msgmax`, `kernel.msgmnb`, `kernel.msgmni`, `kernel.sem`,
  `kernel.shmall`, `kernel.shmmax`, `kernel.shmmni`, `kernel.shm_rmid_forced`.
- Sysctls beginning with `fs.mqueue.*`
- If you use the `--ipc=host` option these sysctls are not allowed.

Network Namespace:

- Sysctls beginning with `net.*`
- If you use the `--network=host` option using these sysctls are not allowed.
