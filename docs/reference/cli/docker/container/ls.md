---
datafolder: engine-cli
datafile: docker_container_ls
linkTitle: docker ps
title: docker container ls
aliases:
  - /edge/engine/reference/commandline/container_ls/
  - /engine/reference/commandline/container_ls/
  - /engine/reference/commandline/ps/
  - /reference/cli/docker/ps/
  - /reference/cli/docker/container/ps/
layout: cli
---

# docker container ls {#docker-container-ls}

| 항목       | 내용                                                                            |
| ---------- | ------------------------------------------------------------------------------- |
| **사용법** | `docker container ls [OPTIONS]`                                                 |
| **설명**   | 컨테이너 목록                                                                   |
| **별칭**   | `docker container ls` `docker container list` `docker container ps` `docker ps` |

## 설명 {#description}

컨테이너 목록

## 옵션 {#options}

| 옵션          | 기본값 | 설명                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-a --all`    |        | 모든 컨테이너 표시 (기본값은 실행 중인 컨테이너만 표시)                                                                                                                                                                                                                                                                                                                                             |
| `-f --filter` |        | 제공된 조건에 따라 출력 필터링                                                                                                                                                                                                                                                                                                                                                                      |
| `--format`    |        | 사용자 정의 템플릿을 사용하여 출력 형식 지정:<br />'table': 열 머리글이 있는 테이블 형식으로 출력 (기본값)<br />'table TEMPLATE': 주어진 Go 템플릿을 사용하여 테이블 형식으로 출력<br />'json': JSON 형식으로 출력<br />'TEMPLATE': 주어진 Go 템플릿을 사용하여 출력.<br />템플릿을 사용하여 출력 형식을 지정하는 방법에 대한 자세한 내용은 https://docs.docker.com/go/formatting/ 을 참조하십시오. |
| `-n --last`   | `-1`   | 마지막으로 생성된 n개의 컨테이너 표시 (모든 상태 포함)                                                                                                                                                                                                                                                                                                                                              |
| `-l --latest` |        | 마지막으로 생성된 컨테이너 표시 (모든 상태 포함)                                                                                                                                                                                                                                                                                                                                                    |
| `--no-trunc`  |        | 출력 생략하지 않음                                                                                                                                                                                                                                                                                                                                                                                  |
| `-q --quiet`  |        | 컨테이너 ID만 표시                                                                                                                                                                                                                                                                                                                                                                                  |
| `-s --size`   |        | 총 파일 크기 표시                                                                                                                                                                                                                                                                                                                                                                                   |

---

## 예제 {#examples}

### 출력 생략하지 않음 (--no-trunc) {#no-trunc}

`docker ps --no-trunc` 명령을 실행하여 2개의 연결된 컨테이너를 표시합니다.

```console
$ docker ps --no-trunc

CONTAINER ID                                                     IMAGE                        COMMAND                CREATED              STATUS              PORTS               NAMES
ca5534a51dd04bbcebe9b23ba05f389466cf0c190f1f8f182d7eea92a9671d00 ubuntu:24.04                 bash                   17 seconds ago       Up 16 seconds       3300-3310/tcp       webapp
9ca9747b233100676a48cc7806131586213fa5dab86dd1972d6a8732e3a84a4d crosbymichael/redis:latest   /redis-server --dir    33 minutes ago       Up 33 minutes       6379/tcp            redis,webapp/db
```

### 실행 중인 컨테이너와 중지된 컨테이너 모두 표시 (-a, --all) {#all}

`docker ps` 명령은 기본적으로 실행 중인 컨테이너만 표시합니다. 모든 컨테이너를 보려면 `--all` (또는 `-a`) 플래그를 사용하십시오:

```console
$ docker ps -a
```

`docker ps`는 노출된 포트를 가능한 한 단일 범위로 그룹화합니다. 예를 들어, TCP 포트 `100, 101, 102`를 노출하는 컨테이너는 `PORTS` 열에 `100-102/tcp`로 표시됩니다.

### 컨테이너별 디스크 사용량 표시 (--size) {#size}

`docker ps --size` (또는 `-s`) 명령은 각 컨테이너에 대해 두 가지 다른 디스크 사용량을 표시합니다:

```console
$ docker ps --size

CONTAINER ID   IMAGE          COMMAND                  CREATED        STATUS       PORTS   NAMES        SIZE
e90b8831a4b8   nginx          "/bin/bash -c 'mkdir "   11 weeks ago   Up 4 hours           my_nginx     35.58 kB (virtual 109.2 MB)
00c6131c5e30   telegraf:1.5   "/entrypoint.sh"         11 weeks ago   Up 11 weeks          my_telegraf  0 B (virtual 209.5 MB)
```

- "size" 정보는 각 컨테이너의 _쓰기 가능한_ 레이어에 사용된 데이터 (디스크 상)의 양을 표시합니다.
- "virtual size"는 컨테이너에서 사용된 읽기 전용 _이미지_ 데이터와 쓰기 가능한 레이어에 사용된 총 디스크 공간을 나타냅니다.

자세한 내용은 [디스크 상의 컨테이너 크기](/engine/storage/drivers/#container-size-on-disk) 섹션을 참조하십시오.

### 필터링 (--filter) {#filter}

`--filter` (또는 `-f`) 플래그 형식은 `key=value` 쌍입니다. 필터가 여러 개 있는 경우 여러 플래그를 전달하십시오 (예: `--filter "foo=bar" --filter "bif=baz"`).

현재 지원되는 필터는 다음과 같습니다:

| 필터                    | 설명                                                                                                                            |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `id`                    | 컨테이너의 ID                                                                                                                   |
| `name`                  | 컨테이너의 이름                                                                                                                 |
| `label`                 | 키 또는 키-값 쌍을 나타내는 임의의 문자열. `<key>` 또는 `<key>=<value>`로 표현됨                                                |
| `exited`                | 컨테이너의 종료 코드를 나타내는 정수. `--all`과 함께 사용할 때만 유용함.                                                        |
| `status`                | `created`, `restarting`, `running`, `removing`, `paused`, `exited`, 또는 `dead` 중 하나                                         |
| `ancestor`              | 주어진 이미지를 조상으로 공유하는 컨테이너를 필터링합니다. `<image-name>[:<tag>]`, `<image id>`, 또는 `<image@digest>`로 표현됨 |
| `before` 또는 `since`   | 주어진 컨테이너 ID 또는 이름 이전 또는 이후에 생성된 컨테이너를 필터링합니다                                                    |
| `volume`                | 주어진 볼륨 또는 바인드 마운트를 마운트한 실행 중인 컨테이너를 필터링합니다.                                                    |
| `network`               | 주어진 네트워크에 연결된 실행 중인 컨테이너를 필터링합니다.                                                                     |
| `publish` 또는 `expose` | 주어진 포트를 게시하거나 노출하는 컨테이너를 필터링합니다. `<port>[/<proto>]` 또는 `<startport-endport>/[<proto>]`로 표현됨     |
| `health`                | 컨테이너의 헬스체크 상태를 기준으로 필터링합니다. `starting`, `healthy`, `unhealthy` 또는 `none` 중 하나.                       |
| `isolation`             | Windows 데몬 전용. `default`, `process`, 또는 `hyperv` 중 하나.                                                                 |
| `is-task`               | 서비스의 "작업"인 컨테이너를 필터링합니다. 부울 옵션 (`true` 또는 `false`)                                                      |

#### label {#label}

`label` 필터는 `label`만 또는 `label`과 값을 기준으로 컨테이너를 필터링합니다.

다음 필터는 값에 관계없이 `color` 레이블이 있는 컨테이너를 일치시킵니다.

```console
$ docker ps --filter "label=color"

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
673394ef1d4c        busybox             "top"               47 seconds ago      Up 45 seconds                           nostalgic_shockley
d85756f57265        busybox             "top"               52 seconds ago      Up 51 seconds                           high_albattani
```

다음 필터는 `color` 레이블이 `blue` 값인 컨테이너를 일치시킵니다.

```console
$ docker ps --filter "label=color=blue"

CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS               NAMES
d85756f57265        busybox             "top"               About a minute ago   Up About a minute                       high_albattani
```

#### name {#name}

`name` 필터는 컨테이너 이름의 전체 또는 일부와 일치합니다.

다음 필터는 `nostalgic_stallman` 문자열을 포함하는 이름을 가진 모든 컨테이너와 일치합니다.

```console
$ docker ps --filter "name=nostalgic_stallman"

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
9b6247364a03        busybox             "top"               2 minutes ago       Up 2 minutes                            nostalgic_stallman
```

다음과 같이 이름의 하위 문자열을 필터링할 수도 있습니다:

```console
$ docker ps --filter "name=nostalgic"

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
715ebfcee040        busybox             "top"               3 seconds ago       Up 1 second                             i_am_nostalgic
9b6247364a03        busybox             "top"               7 minutes ago       Up 7 minutes                            nostalgic_stallman
673394ef1d4c        busybox             "top"               38 minutes ago      Up 38 minutes                           nostalgic_shockley
```

#### exited {#exited}

`exited` 필터는 종료 상태 코드로 컨테이너를 필터링합니다. 예를 들어, 성공적으로 종료된 컨테이너를 필터링하려면:

```console
$ docker ps -a --filter 'exited=0'

CONTAINER ID        IMAGE             COMMAND                CREATED             STATUS                   PORTS                      NAMES
ea09c3c82f6e        registry:latest   /srv/run.sh            2 weeks ago         Exited (0) 2 weeks ago   127.0.0.1:5000->5000/tcp   desperate_leakey
106ea823fe4e        fedora:latest     /bin/sh -c 'bash -l'   2 weeks ago         Exited (0) 2 weeks ago                              determined_albattani
48ee228c9464        fedora:20         bash                   2 weeks ago         Exited (0) 2 weeks ago                              tender_torvalds
```

#### 종료 신호로 필터링 {#filter-by-exit-signal}

`137` 상태로 종료된 컨테이너를 찾기 위해 필터를 사용할 수 있습니다. 이는 `SIGKILL(9)`에 의해 종료된 것을 의미합니다.

```console
$ docker ps -a --filter 'exited=137'

CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS                       PORTS               NAMES
b3e1c0ed5bfe        ubuntu:latest       "sleep 1000"           12 seconds ago      Exited (137) 5 seconds ago                       grave_kowalevski
a2eb5558d669        redis:latest        "/entrypoint.sh redi   2 hours ago         Exited (137) 2 hours ago                         sharp_lalande
```

다음 이벤트 중 하나가 발생하면 `137` 상태가 됩니다:

- 컨테이너의 `init` 프로세스가 수동으로 종료됨
- `docker kill`이 컨테이너를 종료함
- Docker 데몬이 재시작되어 실행 중인 모든 컨테이너가 종료됨

#### status {#status}

`status` 필터는 상태별로 컨테이너를 필터링합니다. 컨테이너 상태의 가능한 값은 다음과 같습니다:

| 상태         | 설명                                                                                                                                                                 |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `created`    | 한 번도 시작되지 않은 컨테이너.                                                                                                                                      |
| `running`    | `docker start` 또는 `docker run`에 의해 시작된 실행 중인 컨테이너.                                                                                                   |
| `paused`     | 일시 중지된 컨테이너. `docker pause` 참조.                                                                                                                           |
| `restarting` | 해당 컨테이너의 지정된 재시작 정책에 따라 시작 중인 컨테이너.                                                                                                        |
| `exited`     | 더 이상 실행되지 않는 컨테이너. 예를 들어, 컨테이너 내부의 프로세스가 완료되었거나 `docker stop` 명령을 사용하여 컨테이너가 중지되었습니다.                          |
| `removing`   | 제거 중인 컨테이너. `docker rm` 참조.                                                                                                                                |
| `dead`       | "비정상" 컨테이너; 예를 들어, 외부 프로세스에 의해 리소스가 바쁘게 유지되어 부분적으로만 제거된 컨테이너. `dead` 컨테이너는 (재)시작할 수 없으며, 제거만 가능합니다. |

예를 들어, `running` 컨테이너를 필터링하려면:

```console
$ docker ps --filter status=running

CONTAINER ID        IMAGE                  COMMAND             CREATED             STATUS              PORTS               NAMES
715ebfcee040        busybox                "top"               16 minutes ago      Up 16 minutes                           i_am_nostalgic
d5c976d3c462        busybox                "top"               23 minutes ago      Up 23 minutes                           top
9b6247364a03        busybox                "top"               24 minutes ago      Up 24 minutes                           nostalgic_stallman
```

`paused` 컨테이너를 필터링하려면:

```console
$ docker ps --filter status=paused

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
673394ef1d4c        busybox             "top"               About an hour ago   Up About an hour (Paused)                       nostalgic_shockley
```

#### ancestor {#ancestor}

`ancestor` 필터는 이미지 또는 그 후손을 기준으로 컨테이너를 필터링합니다. 필터는 다음 이미지 표현을 지원합니다:

- `image`
- `image:tag`
- `image:tag@digest`
- `short-id`
- `full-id`

`tag`를 지정하지 않으면 `latest` 태그가 사용됩니다. 예를 들어, 최신 `ubuntu` 이미지를 사용하는 컨테이너를 필터링하려면:

```console
$ docker ps --filter ancestor=ubuntu

CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS               NAMES
919e1179bdb8        ubuntu-c1           "top"               About a minute ago   Up About a minute                       admiring_lovelace
5d1e4a540723        ubuntu-c2           "top"               About a minute ago   Up About a minute                       admiring_sammet
82a598284012        ubuntu              "top"               3 minutes ago        Up 3 minutes                            sleepy_bose
bab2a34ba363        ubuntu              "top"               3 minutes ago        Up 3 minutes                            focused_yonath
```

이 경우 `ubuntu`의 자식인 `ubuntu-c1` 이미지를 기준으로 컨테이너를 필터링합니다:

```console
$ docker ps --filter ancestor=ubuntu-c1

CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS               NAMES
919e1179bdb8        ubuntu-c1           "top"               About a minute ago   Up About a minute                       admiring_lovelace
```

`ubuntu` 버전 `24.04` 이미지를 기준으로 컨테이너를 필터링합니다:

```console
$ docker ps --filter ancestor=ubuntu:24.04

CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS               NAMES
82a598284012        ubuntu:24.04        "top"               3 minutes ago        Up 3 minutes                            sleepy_bose
```

다음은 레이어 `d0e008c6cf02` 또는 이 레이어를 레이어 스택에 포함하는 이미지를 기준으로 컨테이너를 필터링합니다.

```console
$ docker ps --filter ancestor=d0e008c6cf02

CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS               NAMES
82a598284012        ubuntu:24.04        "top"               3 minutes ago        Up 3 minutes                            sleepy_bose
```

#### 생성 시간 {#create-time}

##### before {#before}

`before` 필터는 주어진 ID 또는 이름을 가진 컨테이너 이전에 생성된 컨테이너만 표시합니다. 예를 들어, 다음과 같은 컨테이너가 생성된 경우:

```console
$ docker ps

CONTAINER ID        IMAGE       COMMAND       CREATED              STATUS              PORTS              NAMES
9c3527ed70ce        busybox     "top"         14 seconds ago       Up 15 seconds                          desperate_dubinsky
4aace5031105        busybox     "top"         48 seconds ago       Up 49 seconds                          focused_hamilton
6e63f6ff38b0        busybox     "top"         About a minute ago   Up About a minute                      distracted_fermat
```

`before` 필터를 사용하면 다음과 같은 결과가 나옵니다:

```console
$ docker ps -f before=9c3527ed70ce

CONTAINER ID        IMAGE       COMMAND       CREATED              STATUS              PORTS              NAMES
4aace5031105        busybox     "top"         About a minute ago   Up About a minute                      focused_hamilton
6e63f6ff38b0        busybox     "top"         About a minute ago   Up About a minute                      distracted_fermat
```

##### since {#since}

`since` 필터는 주어진 ID 또는 이름을 가진 컨테이너 이후에 생성된 컨테이너만 표시합니다. 예를 들어, `before` 필터와 동일한 컨테이너가 있는 경우:

```console
$ docker ps -f since=6e63f6ff38b0

CONTAINER ID        IMAGE       COMMAND       CREATED             STATUS              PORTS               NAMES
9c3527ed70ce        busybox     "top"         10 minutes ago      Up 10 minutes                           desperate_dubinsky
4aace5031105        busybox     "top"         10 minutes ago      Up 10 minutes                           focused_hamilton
```

#### volume {#volume}

`volume` 필터는 특정 볼륨을 마운트하거나 특정 경로에 볼륨을 마운트한 컨테이너만 표시합니다:

```console
$ docker ps --filter volume=remote-volume --format "table {{.ID}}\t{{.Mounts}}"

CONTAINER ID        MOUNTS
9c3527ed70ce        remote-volume

$ docker ps --filter volume=/data --format "table {{.ID}}\t{{.Mounts}}"

CONTAINER ID        MOUNTS
9c3527ed70ce        remote-volume
```

#### network {#network}

`network` 필터는 주어진 이름 또는 ID를 가진 네트워크에 연결된 컨테이너만 표시합니다.

다음 필터는 `net1`이라는 이름을 포함하는 네트워크에 연결된 모든 컨테이너와 일치합니다.

```console
$ docker run -d --net=net1 --name=test1 ubuntu top
$ docker run -d --net=net2 --name=test2 ubuntu top

$ docker ps --filter network=net1

CONTAINER ID        IMAGE       COMMAND       CREATED             STATUS              PORTS               NAMES
9d4893ed80fe        ubuntu      "top"         10 minutes ago      Up 10 minutes                           test1
```

네트워크 필터는 네트워크의 이름과 ID 모두와 일치합니다. 다음 예제는 네트워크 ID를 필터로 사용하여 `net1` 네트워크에 연결된 모든 컨테이너를 표시합니다:

```console
$ docker network inspect --format "{{.ID}}" net1

8c0b4110ae930dbe26b258de9bc34a03f98056ed6f27f991d32919bfe401d7c5

$ docker ps --filter network=8c0b4110ae930dbe26b258de9bc34a03f98056ed6f27f991d32919bfe401d7c5

CONTAINER ID        IMAGE       COMMAND       CREATED             STATUS              PORTS               NAMES
9d4893ed80fe        ubuntu      "top"         10 minutes ago      Up 10 minutes                           test1
```

#### publish and expose {#publish-and-expose}

`publish` 및 `expose` 필터는 주어진 포트 번호, 포트 범위 및/또는 프로토콜을 가진 게시된 또는 노출된 포트를 가진 컨테이너만 표시합니다. 기본 프로토콜은 지정되지 않은 경우 `tcp`입니다.

다음 필터는 포트 80을 게시한 모든 컨테이너와 일치합니다:

```console
$ docker run -d --publish=80 busybox top
$ docker run -d --expose=8080 busybox top

$ docker ps -a

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                   NAMES
9833437217a5        busybox             "top"               5 seconds ago       Up 4 seconds        8080/tcp                dreamy_mccarthy
fc7e477723b7        busybox             "top"               50 seconds ago      Up 50 seconds       0.0.0.0:32768->80/tcp   admiring_roentgen

$ docker ps --filter publish=80

CONTAINER ID        IMAGE               COMMAND             CREATED              STATUS              PORTS                   NAMES
fc7e477723b7        busybox             "top"               About a minute ago   Up About a minute   0.0.0.0:32768->80/tcp   admiring_roentgen
```

다음 필터는 `8000-8080` 범위의 TCP 포트를 노출한 모든 컨테이너와 일치합니다:

```console
$ docker ps --filter expose=8000-8080/tcp

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
9833437217a5        busybox             "top"               21 seconds ago      Up 19 seconds       8080/tcp            dreamy_mccarthy
```

다음 필터는 UDP 포트 `80`을 노출한 모든 컨테이너와 일치합니다:

```console
$ docker ps --filter publish=80/udp

CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

### 출력 형식 지정 (--format) {#format}

형식 지정 옵션 (`--format`)은 Go 템플릿을 사용하여 컨테이너 출력을 예쁘게 출력합니다.

Go 템플릿에 대한 유효한 자리 표시자는 아래에 나열되어 있습니다:

| 자리 표시자   | 설명                                                                           |
| :------------ | :----------------------------------------------------------------------------- |
| `.ID`         | 컨테이너 ID                                                                    |
| `.Image`      | 이미지 ID                                                                      |
| `.Command`    | 인용된 명령어                                                                  |
| `.CreatedAt`  | 컨테이너가 생성된 시간.                                                        |
| `.RunningFor` | 컨테이너가 시작된 이후 경과 시간.                                              |
| `.Ports`      | 노출된 포트.                                                                   |
| `.State`      | 컨테이너 상태 (예: "created", "running", "exited").                            |
| `.Status`     | 지속 시간 및 상태에 대한 세부 정보가 포함된 컨테이너 상태.                     |
| `.Size`       | 컨테이너 디스크 크기.                                                          |
| `.Names`      | 컨테이너 이름.                                                                 |
| `.Labels`     | 컨테이너에 할당된 모든 레이블.                                                 |
| `.Label`      | 이 컨테이너에 대한 특정 레이블의 값. 예: `'{{.Label "com.docker.swarm.cpu"}}'` |
| `.Mounts`     | 이 컨테이너에 마운트된 볼륨의 이름.                                            |
| `.Networks`   | 이 컨테이너에 연결된 네트워크의 이름.                                          |

`--format` 옵션을 사용할 때, `ps` 명령은 템플릿이 선언한 대로 데이터를 출력하거나, `table` 지시어를 사용할 때는 열 머리글도 포함합니다.

다음 예제는 헤더 없이 템플릿을 사용하여 모든 실행 중인 컨테이너의 `ID`와 `Command` 항목을 콜론 (`:`)으로 구분하여 출력합니다:

```console
$ docker ps --format "{{.ID}}: {{.Command}}"

a87ecb4f327c: /bin/sh -c #(nop) MA
01946d9d34d8: /bin/sh -c #(nop) MA
c1d3b0166030: /bin/sh -c yum -y up
41d50ecd2f57: /bin/sh -c #(nop) MA
```

실행 중인 모든 컨테이너를 레이블과 함께 테이블 형식으로 나열하려면 다음을 사용할 수 있습니다:

```console
$ docker ps --format "table {{.ID}}\t{{.Labels}}"

CONTAINER ID        LABELS
a87ecb4f327c        com.docker.swarm.node=ubuntu,com.docker.swarm.storage=ssd
01946d9d34d8
c1d3b0166030        com.docker.swarm.node=debian,com.docker.swarm.cpu=6
41d50ecd2f57        com.docker.swarm.node=fedora,com.docker.swarm.cpu=3,com.docker.swarm.storage=ssd
```

실행 중인 모든 컨테이너를 JSON 형식으로 나열하려면 `json` 지시어를 사용하십시오:

```console
$ docker ps --format json
{"Command":"\"/docker-entrypoint.…\"","CreatedAt":"2021-03-10 00:15:05 +0100 CET","ID":"a762a2b37a1d","Image":"nginx","Labels":"maintainer=NGINX Docker Maintainers \u003cdocker-maint@nginx.com\u003e","LocalVolumes":"0","Mounts":"","Names":"boring_keldysh","Networks":"bridge","Ports":"80/tcp","RunningFor":"4 seconds ago","Size":"0B","State":"running","Status":"Up 3 seconds"}
```
