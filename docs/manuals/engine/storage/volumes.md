---
description:
  Docker가 생성하고 사용하는 데이터를 지속시키기 위해 바인드 마운트 대신 볼륨을 생성, 관리, 사용하는 방법을 배웁니다.
title: 볼륨
weight: 10
keywords:
  - 도커 컴포즈 볼륨
  - 도커 볼륨
  - 도커 컴포즈 볼륨
  - 도커 볼륨 마운트
  - 도커 마운트 볼륨
  - 도커 볼륨 생성
  - 도커 볼륨 위치
aliases:
  - /userguide/dockervolumes/
  - /engine/tutorials/dockervolumes/
  - /engine/userguide/dockervolumes/
  - /engine/admin/volumes/volumes/
  - /storage/volumes/
---

볼륨은 Docker가 생성하고 관리하는 컨테이너의 지속적인 데이터 저장소입니다. `docker volume create` 명령을 사용하여 명시적으로 볼륨을 생성하거나, 컨테이너 또는 서비스 생성 중에 Docker가 볼륨을 생성할 수 있습니다.

볼륨을 생성하면 Docker 호스트의 디렉토리에 저장됩니다. 볼륨을 컨테이너에 마운트하면 이 디렉토리가 컨테이너에 마운트됩니다. 이는 바인드 마운트가 작동하는 방식과 유사하지만, 볼륨은 Docker에 의해 관리되며 호스트 머신의 핵심 기능과 격리됩니다.

## 볼륨을 사용할 때 {#when-to-use-volumes}

볼륨은 Docker 컨테이너가 생성하고 사용하는 데이터를 지속시키기 위한 선호 메커니즘입니다. [바인드 마운트](bind-mounts.md)는 호스트 머신의 디렉토리 구조와 OS에 의존하지만, 볼륨은 Docker에 의해 완전히 관리됩니다. 볼륨은 다음과 같은 사용 사례에 적합합니다:

- 볼륨은 바인드 마운트보다 백업하거나 마이그레이션하기 쉽습니다.
- Docker CLI 명령 또는 Docker API를 사용하여 볼륨을 관리할 수 있습니다.
- 볼륨은 Linux와 Windows 컨테이너 모두에서 작동합니다.
- 볼륨은 여러 컨테이너 간에 더 안전하게 공유될 수 있습니다.
- 새로운 볼륨은 컨테이너 또는 빌드에 의해 사전 채워질 수 있습니다.
- 애플리케이션이 고성능 I/O를 요구할 때.

호스트에서 파일에 액세스해야 하는 경우 볼륨은 좋은 선택이 아닙니다. 볼륨은 Docker에 의해 완전히 관리되기 때문입니다. 컨테이너와 호스트 모두에서 파일이나 디렉토리에 액세스해야 하는 경우 [바인드 마운트](bind-mounts.md)를 사용하십시오.

볼륨은 데이터를 컨테이너에 직접 쓰는 것보다 더 나은 선택인 경우가 많습니다. 볼륨을 사용하면 컨테이너의 크기가 증가하지 않기 때문입니다. 또한 볼륨을 사용하는 것이 더 빠릅니다. 컨테이너의 쓰기 가능한 레이어에 쓰는 것은 파일 시스템을 관리하기 위해 [스토리지 드라이버](/manuals/engine/storage/drivers/_index.md)가 필요합니다. 스토리지 드라이버는 Linux 커널을 사용하여 유니온 파일 시스템을 제공합니다. 이 추가 추상화는 볼륨을 사용하는 것보다 성능을 저하시킵니다. 볼륨은 호스트 파일 시스템에 직접 쓰기 때문입니다.

컨테이너가 비영구 상태 데이터를 생성하는 경우, 데이터를 영구적으로 저장하지 않고 컨테이너의 성능을 높이기 위해 [tmpfs 마운트](tmpfs.md)를 사용하는 것을 고려하십시오.

볼륨은 `rprivate` 바인드 전파를 사용하며, 바인드 전파는 볼륨에 대해 구성할 수 없습니다.

## 볼륨의 수명 주기 {#a-volumes-lifecycle}

볼륨의 내용은 주어진 컨테이너의 수명 주기 외부에 존재합니다. 컨테이너가 파괴되면 쓰기 가능한 레이어도 함께 파괴됩니다. 볼륨을 사용하면 컨테이너가 제거되더라도 데이터가 지속됩니다.

주어진 볼륨은 여러 컨테이너에 동시에 마운트될 수 있습니다. 실행 중인 컨테이너가 볼륨을 사용하지 않을 때도 볼륨은 Docker에 여전히 사용 가능하며 자동으로 제거되지 않습니다. `docker volume prune`을 사용하여 사용하지 않는 볼륨을 제거할 수 있습니다.

## 기존 데이터 위에 볼륨 마운트 {#mounting-a-volume-over-existing-data}

파일이나 디렉토리가 있는 컨테이너의 디렉토리에 _비어 있지 않은 볼륨_ 을 마운트하면, 기존 파일이 마운트에 의해 가려집니다. 이는 Linux 호스트에서 `/mnt`에 파일을 저장한 다음 USB 드라이브를 `/mnt`에 마운트한 것과 유사합니다. USB 드라이브가 마운트 해제될 때까지 `/mnt`의 내용이 USB 드라이브의 내용에 의해 가려집니다.

컨테이너의 경우, 마운트를 제거하여 가려진 파일을 다시 표시하는 간단한 방법이 없습니다. 가장 좋은 방법은 마운트 없이 컨테이너를 다시 생성하는 것입니다.

파일이나 디렉토리가 있는 컨테이너의 디렉토리에 _비어 있는 볼륨_ 을 마운트하면, 이러한 파일이나 디렉토리가 기본적으로 볼륨에 복사됩니다. 마찬가지로, 컨테이너를 시작하고 아직 존재하지 않는 볼륨을 지정하면, 비어 있는 볼륨이 생성됩니다. 이는 다른 컨테이너가 필요한 데이터를 사전 채우는 좋은 방법입니다.

Docker가 컨테이너의 기존 파일을 비어 있는 볼륨에 복사하지 않도록 하려면 `volume-nocopy` 옵션을 사용하십시오. 자세한 내용은 [--mount 옵션](#options-for---mount)을 참조하십시오.

## 명명된 볼륨과 익명 볼륨 {#named-and-anonymous-volumes}

볼륨은 명명되거나 익명일 수 있습니다. 익명 볼륨은 주어진 Docker 호스트 내에서 고유하도록 보장되는 임의의 이름이 부여됩니다. 명명된 볼륨과 마찬가지로, 익명 볼륨은 이를 사용하는 컨테이너를 제거해도 지속됩니다. 단, 컨테이너를 생성할 때 `--rm` 플래그를 사용하면 익명 볼륨이 파괴됩니다. 자세한 내용은 [익명 볼륨 제거](volumes.md#remove-anonymous-volumes)를 참조하십시오.

익명 볼륨을 사용하는 여러 컨테이너를 연속적으로 생성하면 각 컨테이너는 자체 볼륨을 생성합니다. 익명 볼륨은 자동으로 컨테이너 간에 재사용되거나 공유되지 않습니다. 두 개 이상의 컨테이너 간에 익명 볼륨을 공유하려면 임의의 볼륨 ID를 사용하여 익명 볼륨을 마운트해야 합니다.

## 구문 {#syntax}

`docker run` 명령을 사용하여 볼륨을 마운트하려면 `--mount` 또는 `--volume` 플래그를 사용할 수 있습니다.

```console
$ docker run --mount type=volume,src=<volume-name>,dst=<mount-path>
$ docker run --volume <volume-name>:<mount-path>
```

일반적으로 `--mount`가 선호됩니다. 주요 차이점은 `--mount` 플래그가 더 명확하고 사용 가능한 모든 옵션을 지원한다는 것입니다.

다음과 같은 경우 `--mount`를 사용해야 합니다:

- [볼륨 드라이버 옵션](#use-a-volume-driver) 지정
- [볼륨 하위 디렉토리 마운트](#mount-a-volume-subdirectory)
- Swarm 서비스에 볼륨 마운트

### --mount 옵션 {#options-for---mount}

`--mount` 플래그는 쉼표로 구분된 여러 키-값 쌍으로 구성되며 각 쌍은 `<key>=<value>` 튜플로 구성됩니다. 키의 순서는 중요하지 않습니다.

```console
$ docker run --mount type=volume[,src=<volume-name>],dst=<mount-path>[,<key>=<value>...]
```

`--mount type=volume`에 대한 유효한 옵션은 다음과 같습니다:

| 옵션                         | 설명                                                                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`, `src`                | 마운트의 소스입니다. 명명된 볼륨의 경우, 이는 볼륨의 이름입니다. 익명 볼륨의 경우, 이 필드는 생략됩니다.                                                                                                       |
| `destination`, `dst`, `target` | 파일 또는 디렉토리가 컨테이너에 마운트되는 경로입니다.                                                                                                                                                               |
| `volume-subpath`               | 볼륨 내의 하위 디렉토리에 대한 경로로, 컨테이너에 마운트됩니다. 하위 디렉토리는 볼륨이 컨테이너에 마운트되기 전에 볼륨에 존재해야 합니다. 자세한 내용은 [볼륨 하위 디렉토리 마운트](#mount-a-volume-subdirectory)를 참조하십시오. |
| `readonly`, `ro`               | 존재하는 경우, 볼륨을 [읽기 전용으로 컨테이너에 마운트](#use-a-read-only-volume)합니다.                                                                                                                         |
| `volume-nocopy`                | 존재하는 경우, 대상의 데이터가 비어 있는 경우 볼륨에 복사되지 않습니다. 기본적으로, 대상 위치의 내용은 비어 있는 경우 마운트된 볼륨에 복사됩니다.                                              |
| `volume-opt`                   | 여러 번 지정할 수 있으며, 옵션 이름과 값을 포함하는 키-값 쌍을 받습니다.                                                                                                                            |

```console {title="예제"}
$ docker run --mount type=volume,src=myvolume,dst=/data,ro,volume-subpath=/foo
```

### --volume 옵션 {#options-for---volume}

`--volume` 또는 `-v` 플래그는 콜론 문자(`:`)로 구분된 세 개의 필드로 구성됩니다. 필드는 올바른 순서로 있어야 합니다.

```console
$ docker run -v [<volume-name>:]<mount-path>[:opts]
```

명명된 볼륨의 경우, 첫 번째 필드는 볼륨의 이름이며, 주어진 호스트 머신에서 고유합니다. 익명 볼륨의 경우, 첫 번째 필드는 생략됩니다. 두 번째 필드는 파일 또는 디렉토리가 컨테이너에 마운트되는 경로입니다.

세 번째 필드는 선택 사항이며, 옵션의 쉼표로 구분된 목록입니다. 데이터 볼륨에 대한 `--volume`의 유효한 옵션은 다음과 같습니다:

| 옵션           | 설명                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `readonly`, `ro` | 존재하는 경우, 볼륨을 [읽기 전용으로 컨테이너에 마운트](#use-a-read-only-volume)합니다.                                                                            |
| `volume-nocopy`  | 존재하는 경우, 대상의 데이터가 비어 있는 경우 볼륨에 복사되지 않습니다. 기본적으로, 대상 위치의 내용은 비어 있는 경우 마운트된 볼륨에 복사됩니다. |

```console {title="예제"}
$ docker run -v myvolume:/data:ro
```

## 볼륨 생성 및 관리 {#create-and-manage-volumes}

바인드 마운트와 달리, 컨테이너의 범위를 벗어나 볼륨을 생성하고 관리할 수 있습니다.

볼륨 생성:

```console
$ docker volume create my-vol
```

볼륨 목록:

```console
$ docker volume ls

local               my-vol
```

볼륨 검사:

```console
$ docker volume inspect my-vol
[
    {
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my-vol/_data",
        "Name": "my-vol",
        "Options": {},
        "Scope": "local"
    }
]
```

볼륨 제거:

```console
$ docker volume rm my-vol
```

## 볼륨과 함께 컨테이너 시작 {#start-a-container-with-a-volume}

존재하지 않는 볼륨으로 컨테이너를 시작하면 Docker가 볼륨을 생성합니다. 다음 예제는 `myvol2` 볼륨을 컨테이너의 `/app/`에 마운트합니다.

다음 `-v` 및 `--mount` 예제는 동일한 결과를 생성합니다. 첫 번째 예제를 실행한 후 `devtest` 컨테이너와 `myvol2` 볼륨을 제거하지 않으면 둘 다 실행할 수 없습니다.

<Tabs>
<TabItem value="--mount" label="--mount">

```console
$ docker run -d \
  --name devtest \
  --mount source=myvol2,target=/app \
  nginx:latest
```

</TabItem>
<TabItem value="-v" label="-v">

```console
$ docker run -d \
  --name devtest \
  -v myvol2:/app \
  nginx:latest
```

</TabItem>
</Tabs>

`docker inspect devtest`를 사용하여 Docker가 볼륨을 생성하고 올바르게 마운트했는지 확인하십시오. `Mounts` 섹션을 찾으십시오:

```json
"Mounts": [
    {
        "Type": "volume",
        "Name": "myvol2",
        "Source": "/var/lib/docker/volumes/myvol2/_data",
        "Destination": "/app",
        "Driver": "local",
        "Mode": "",
        "RW": true,
        "Propagation": ""
    }
],
```

이것은 마운트가 볼륨임을 보여주며, 올바른 소스와 대상, 마운트가 읽기-쓰기 가능함을 보여줍니다.

컨테이너를 중지하고 볼륨을 제거하십시오. 볼륨 제거는 별도의 단계입니다.

```console
$ docker container stop devtest

$ docker container rm devtest

$ docker volume rm myvol2
```

## Docker Compose와 함께 볼륨 사용 {#use-a-volume-with-docker-compose}

다음 예제는 볼륨이 있는 단일 Docker Compose 서비스를 보여줍니다:

```yaml
services:
  frontend:
    image: node:lts
    volumes:
      - myapp:/home/node/app
volumes:
  myapp:
```

처음으로 `docker compose up`을 실행하면 볼륨이 생성됩니다. 이후 명령을 실행할 때 Docker는 동일한 볼륨을 재사용합니다.

`docker volume create`를 사용하여 Compose 외부에서 직접 볼륨을 생성한 다음, `compose.yaml` 내부에서 참조할 수 있습니다:

```yaml
services:
  frontend:
    image: node:lts
    volumes:
      - myapp:/home/node/app
volumes:
  myapp:
    external: true
```

Compose와 함께 볼륨을 사용하는 방법에 대한 자세한 내용은 Compose 사양의 [볼륨](reference/compose-file/volumes.md) 섹션을 참조하십시오.

### 볼륨과 함께 서비스 시작 {#start-a-service-with-volumes}

서비스를 시작하고 볼륨을 정의하면 각 서비스 컨테이너는 자체 로컬 볼륨을 사용합니다. `local` 볼륨 드라이버를 사용하는 경우, 컨테이너는 이 데이터를 공유할 수 없습니다. 그러나 일부 볼륨 드라이버는 공유 스토리지를 지원합니다.

다음 예제는 로컬 볼륨 `myvol2`를 사용하는 4개의 복제본으로 `nginx` 서비스를 시작합니다.

```console
$ docker service create -d \
  --replicas=4 \
  --name devtest-service \
  --mount source=myvol2,target=/app \
  nginx:latest
```

`docker service ps devtest-service`를 사용하여 서비스가 실행 중인지 확인하십시오:

```console
$ docker service ps devtest-service

ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE            ERROR               PORTS
4d7oz1j85wwn        devtest-service.1   nginx:latest        moby                Running             Running 14 seconds ago
```

서비스를 제거하여 실행 중인 작업을 중지할 수 있습니다:

```console
$ docker service rm devtest-service
```

서비스를 제거해도 서비스가 생성한 볼륨은 제거되지 않습니다. 볼륨 제거는 별도의 단계입니다.

### 컨테이너를 사용하여 볼륨 채우기 {#populate-a-volume-using-a-container}

새 볼륨을 생성하는 컨테이너를 시작하고, 컨테이너가 마운트될 디렉토리에 파일이나 디렉토리가 있는 경우(예: `/app/`), Docker는 디렉토리의 내용을 볼륨에 복사합니다. 그런 다음 컨테이너는 볼륨을 마운트하고 사용하며, 볼륨을 사용하는 다른 컨테이너도 사전 채워진 콘텐츠에 액세스할 수 있습니다.

이를 보여주기 위해 다음 예제는 `nginx` 컨테이너를 시작하고 새 볼륨 `nginx-vol`을 컨테이너의 `/usr/share/nginx/html` 디렉토리 내용으로 채웁니다. 이는 Nginx가 기본 HTML 콘텐츠를 저장하는 위치입니다.

`--mount` 및 `-v` 예제는 동일한 결과를 생성합니다.

<Tabs>
<TabItem value="--mount" label="--mount">

```console
$ docker run -d \
  --name=nginxtest \
  --mount source=nginx-vol,destination=/usr/share/nginx/html \
  nginx:latest
```

</TabItem>
<TabItem value="-v" label="-v">

```console
$ docker run -d \
  --name=nginxtest \
  -v nginx-vol:/usr/share/nginx/html \
  nginx:latest
```

</TabItem>
</Tabs>

실행 후, 다음 명령을 실행하여 컨테이너와 볼륨을 정리하십시오. 볼륨 제거는 별도의 단계입니다.

```console
$ docker container stop nginxtest

$ docker container rm nginxtest

$ docker volume rm nginx-vol
```

## 읽기 전용 볼륨 사용 {#use-a-read-only-volume}

일부 개발 애플리케이션의 경우, 컨테이너가 바인드 마운트에 쓰기를 수행하여 변경 사항이 Docker 호스트에 전파되어야 합니다. 다른 경우에는 컨테이너가 데이터에 대한 읽기 액세스만 필요합니다. 여러 컨테이너가 동일한 볼륨을 마운트할 수 있습니다. 단일 볼륨을 일부 컨테이너에는 `읽기-쓰기`로, 다른 컨테이너에는 `읽기 전용`으로 동시에 마운트할 수 있습니다.

다음 예제는 이전 예제를 변경합니다. 빈 기본 옵션 목록 후에 `ro`를 추가하여 디렉토리를 읽기 전용 볼륨으로 마운트합니다. 여러 옵션이 있는 경우 쉼표로 구분하여 사용할 수 있습니다.

`--mount` 및 `-v` 예제는 동일한 결과를 생성합니다.

<Tabs>
<TabItem value="--mount" label="--mount">

```console
$ docker run -d \
  --name=nginxtest \
  --mount source=nginx-vol,destination=/usr/share/nginx/html,readonly \
  nginx:latest
```

</TabItem>
<TabItem value="-v" label="-v">

```console
$ docker run -d \
  --name=nginxtest \
  -v nginx-vol:/usr/share/nginx/html:ro \
  nginx:latest
```

</TabItem>
</Tabs>

`docker inspect nginxtest`를 사용하여 Docker가 읽기 전용 마운트를 올바르게 생성했는지 확인하십시오. `Mounts` 섹션을 찾으십시오:

```json
"Mounts": [
    {
        "Type": "volume",
        "Name": "nginx-vol",
        "Source": "/var/lib/docker/volumes/nginx-vol/_data",
        "Destination": "/usr/share/nginx/html",
        "Driver": "local",
        "Mode": "",
        "RW": false,
        "Propagation": ""
    }
],
```

컨테이너를 중지하고 제거한 후, 볼륨을 제거하십시오. 볼륨 제거는 별도의 단계입니다.

```console
$ docker container stop nginxtest

$ docker container rm nginxtest

$ docker volume rm nginx-vol
```

## 볼륨 하위 디렉토리 마운트 {#mount-a-volume-subdirectory}

볼륨을 컨테이너에 마운트할 때, `--mount` 플래그의 `volume-subpath` 매개변수를 사용하여 볼륨의 하위 디렉토리를 지정할 수 있습니다. 지정한 하위 디렉토리는 컨테이너에 마운트되기 전에 볼륨에 존재해야 합니다. 존재하지 않으면 마운트가 실패합니다.

`volume-subpath`를 지정하는 것은 볼륨의 특정 부분만 컨테이너와 공유하려는 경우 유용합니다. 예를 들어, 여러 컨테이너가 실행 중이고 각 컨테이너의 로그를 공유 볼륨에 저장하려는 경우, 공유 볼륨에 각 컨테이너의 하위 디렉토리를 생성하고 하위 디렉토리를 컨테이너에 마운트할 수 있습니다.

다음 예제는 `logs` 볼륨을 생성하고 볼륨 내에 `app1` 및 `app2` 하위 디렉토리를 초기화합니다. 그런 다음 두 개의 컨테이너를 시작하고 `logs` 볼륨의 하위 디렉토리 중 하나를 각 컨테이너에 마운트합니다. 이 예제는 컨테이너의 프로세스가 `/var/log/app1` 및 `/var/log/app2`에 로그를 기록한다고 가정합니다.

```console
$ docker volume create logs
$ docker run --rm \
  --mount src=logs,dst=/logs \
  alpine mkdir -p /logs/app1 /logs/app2
$ docker run -d \
  --name=app1 \
  --mount src=logs,dst=/var/log/app1/,volume-subpath=app1 \
  app1:latest
$ docker run -d \
  --name=app2 \
  --mount src=logs,dst=/var/log/app2,volume-subpath=app2 \
  app2:latest
```

이 설정을 통해 컨테이너는 `logs` 볼륨의 별도 하위 디렉토리에 로그를 기록합니다. 컨테이너는 다른 컨테이너의 로그에 액세스할 수 없습니다.

## 머신 간 데이터 공유 {#share-data-between-machines}

내결함성 애플리케이션을 구축할 때, 동일한 서비스의 여러 복제본이 동일한 파일에 액세스해야 할 수 있습니다.

![shared storage](images/volumes-shared-storage.webp)

애플리케이션을 개발할 때 이를 달성하는 여러 가지 방법이 있습니다. 하나는 애플리케이션에 로직을 추가하여 Amazon S3와 같은 클라우드 객체 스토리지 시스템에 파일을 저장하는 것입니다. 또 다른 방법은 NFS 또는 Amazon S3와 같은 외부 스토리지 시스템에 파일을 쓰는 드라이버를 사용하여 볼륨을 생성하는 것입니다.

볼륨 드라이버를 사용하면 애플리케이션 로직에서 기본 스토리지 시스템을 추상화할 수 있습니다. 예를 들어, 서비스가 NFS 드라이버를 사용하는 볼륨을 사용하는 경우, 애플리케이션 로직을 변경하지 않고 서비스를 다른 드라이버로 업데이트할 수 있습니다. 예를 들어, 데이터를 클라우드에 저장하는 것입니다.

## 볼륨 드라이버 사용 {#use-a-volume-driver}

`docker volume create`를 사용하여 볼륨을 생성하거나, 아직 생성되지 않은 볼륨을 사용하는 컨테이너를 시작할 때, 볼륨 드라이버를 지정할 수 있습니다. 다음 예제는 독립형 볼륨을 생성할 때와 새 볼륨을 생성하는 컨테이너를 시작할 때 `vieux/sshfs` 볼륨 드라이버를 사용합니다.

:::note
볼륨 드라이버가 쉼표로 구분된 목록을 옵션으로 허용하는 경우,
외부 CSV 파서에서 값을 이스케이프해야 합니다. `volume-opt`를 이스케이프하려면
이중 따옴표(`"`)로 둘러싸고 전체 마운트 매개변수를 단일 따옴표(`'`)로 둘러싸십시오.

예를 들어, `local` 드라이버는 `o` 매개변수에서 쉼표로 구분된 목록을 옵션으로 허용합니다. 이 예제는 목록을 올바르게 이스케이프하는 방법을 보여줍니다.

```console
$ docker service create \
 --mount 'type=volume,src=<VOLUME-NAME>,dst=<CONTAINER-PATH>,volume-driver=local,volume-opt=type=nfs,volume-opt=device=<nfs-server>:<nfs-path>,"volume-opt=o=addr=<nfs-address>,vers=4,soft,timeo=180,bg,tcp,rw"'
 --name myservice \
 <IMAGE>
```
:::

### 초기 설정 {#initial-setup}

다음 예제는 두 개의 노드가 있다고 가정합니다. 첫 번째 노드는 Docker 호스트이며 SSH를 사용하여 두 번째 노드에 연결할 수 있습니다.

Docker 호스트에서 `vieux/sshfs` 플러그인을 설치하십시오:

```console
$ docker plugin install --grant-all-permissions vieux/sshfs
```

### 볼륨 드라이버를 사용하여 볼륨 생성 {#create-a-volume-using-a-volume-driver}

이 예제는 SSH 비밀번호를 지정하지만, 두 호스트에 공유 키가 구성된 경우 비밀번호를 제외할 수 있습니다. 각 볼륨 드라이버는 0개 이상의 구성 가능한 옵션을 가질 수 있으며, 각 옵션을 `-o` 플래그를 사용하여 지정합니다.

```console
$ docker volume create --driver vieux/sshfs \
  -o sshcmd=test@node2:/home/test \
  -o password=testpassword \
  sshvolume
```

### 볼륨 드라이버를 사용하여 볼륨을 생성하는 컨테이너 시작 {#start-a-container-which-creates-a-volume-using-a-volume-driver}

다음 예제는 SSH 비밀번호를 지정합니다. 그러나 두 호스트에 공유 키가 구성된 경우 비밀번호를 제외할 수 있습니다.
각 볼륨 드라이버는 0개 이상의 구성 가능한 옵션을 가질 수 있습니다.

:::note
볼륨 드라이버가 옵션을 전달해야 하는 경우,
`-v`가 아닌 `--mount` 플래그를 사용하여 볼륨을 마운트해야 합니다.
:::

```console
$ docker run -d \
  --name sshfs-container \
  --mount type=volume,volume-driver=vieux/sshfs,src=sshvolume,target=/app,volume-opt=sshcmd=test@node2:/home/test,volume-opt=password=testpassword \
  nginx:latest
```

### NFS 볼륨을 생성하는 서비스 생성 {#create-a-service-which-creates-an-nfs-volume}

다음 예제는 서비스를 생성할 때 NFS 볼륨을 생성하는 방법을 보여줍니다.
NFS 서버로 `10.0.0.10`을 사용하고 NFS 서버에서 내보낸 디렉토리로 `/var/docker-nfs`를 사용합니다.
지정된 볼륨 드라이버는 `local`입니다.

#### NFSv3 {#nfsv3}

```console
$ docker service create -d \
  --name nfs-service \
  --mount 'type=volume,source=nfsvolume,target=/app,volume-driver=local,volume-opt=type=nfs,volume-opt=device=:/var/docker-nfs,volume-opt=o=addr=10.0.0.10' \
  nginx:latest
```

#### NFSv4 {#nfsv4}

```console
$ docker service create -d \
    --name nfs-service \
    --mount 'type=volume,source=nfsvolume,target=/app,volume-driver=local,volume-opt=type=nfs,volume-opt=device=:/var/docker-nfs,"volume-opt=o=addr=10.0.0.10,rw,nfsvers=4,async"' \
    nginx:latest
```

### CIFS/Samba 볼륨 생성 {#create-cifs-samba-volumes}

호스트의 마운트 포인트를 구성하지 않고 Docker에서 직접 Samba 공유를 마운트할 수 있습니다.

```console
$ docker volume create \
  --driver local \
  --opt type=cifs \
  --opt device=//uxxxxx.your-server.de/backup \
  --opt o=addr=uxxxxx.your-server.de,username=uxxxxxxx,password=*****,file_mode=0777,dir_mode=0777 \
  --name cif-volume
```

호스트 이름 대신 IP를 지정하는 경우 `addr` 옵션이 필요합니다.
이를 통해 Docker는 호스트 이름 조회를 수행할 수 있습니다.

### 블록 스토리지 장치 {#block-storage-devices}

외부 드라이브나 드라이브 파티션과 같은 블록 스토리지 장치를 컨테이너에 마운트할 수 있습니다.
다음 예제는 파일을 블록 스토리지 장치로 생성하고 사용하는 방법과 블록 장치를 컨테이너 볼륨으로 마운트하는 방법을 보여줍니다.

:::important
다음 절차는 예제일 뿐입니다.
여기서 설명하는 솔루션은 일반적인 관행으로 권장되지 않습니다.
자신이 무엇을 하고 있는지 확신하지 않는 한 이 접근 방식을 시도하지 마십시오.
:::

#### 블록 장치 마운트 작동 방식 {#how-mounting-block-devices-works}

내부적으로, `local` 스토리지 드라이버를 사용하는 `--mount` 플래그는
Linux `mount` 시스템 호출을 호출하고 전달된 옵션을 변경하지 않고 전달합니다.
Docker는 Linux 커널에서 지원하는 기본 마운트 기능 위에 추가 기능을 구현하지 않습니다.

[Linux `mount` 명령](https://man7.org/linux/man-pages/man8/mount.8.html)에 익숙한 경우,
`--mount` 옵션을 다음과 같이 전달된다고 생각할 수 있습니다:

```console
$ mount -t <mount.volume-opt.type> <mount.volume-opt.device> <mount.dst> -o <mount.volume-opts.o>
```

이를 더 설명하기 위해, 다음 `mount` 명령 예제를 고려하십시오.
이 명령은 `/dev/loop5` 장치를 시스템의 `/external-drive` 경로에 마운트합니다.

```console
$ mount -t ext4 /dev/loop5 /external-drive
```

다음 `docker run` 명령은 실행되는 컨테이너의 관점에서 유사한 결과를 달성합니다.
이 `--mount` 옵션을 사용하여 컨테이너를 실행하면 이전 예제의 `mount` 명령을 실행한 것과 동일한 방식으로 마운트가 설정됩니다.

```console
$ docker run \
  --mount='type=volume,dst=/external-drive,volume-driver=local,volume-opt=device=/dev/loop5,volume-opt=type=ext4'
```

컨테이너 내부에서 `mount` 명령을 직접 실행할 수 없습니다.
컨테이너는 `/dev/loop5` 장치에 액세스할 수 없기 때문입니다.
따라서 `docker run` 명령은 `--mount` 옵션을 사용합니다.

#### 예제: 컨테이너에서 블록 장치 마운트 {#example-mounting-a-block-device-in-a-container}

다음 단계는 `ext4` 파일 시스템을 생성하고 이를 컨테이너에 마운트합니다.
시스템의 파일 시스템 지원은 사용 중인 Linux 커널 버전에 따라 다릅니다.

1. 파일을 생성하고 공간을 할당합니다:

   ```console
   $ fallocate -l 1G disk.raw
   ```

2. `disk.raw` 파일에 파일 시스템을 빌드합니다:

   ```console
   $ mkfs.ext4 disk.raw
   ```

3. 루프 장치를 생성합니다:

   ```console
   $ losetup -f --show disk.raw
   /dev/loop5
   ```

   :::note
   `losetup`은 시스템 재부팅 후 제거되거나
   `losetup -d`를 사용하여 수동으로 제거되는 임시 루프 장치를 생성합니다.
   :::

4. 루프 장치를 볼륨으로 마운트하는 컨테이너를 실행합니다:

   ```console
   $ docker run -it --rm \
     --mount='type=volume,dst=/external-drive,volume-driver=local,volume-opt=device=/dev/loop5,volume-opt=type=ext4' \
     ubuntu bash
   ```

   컨테이너가 시작되면, `/external-drive` 경로는
   호스트 파일 시스템의 `disk.raw` 파일을 블록 장치로 마운트합니다.

5. 완료되면, 장치가 컨테이너에서 마운트 해제되고,
   루프 장치를 분리하여 호스트 시스템에서 장치를 제거합니다:

   ```console
   $ losetup -d /dev/loop5
   ```

## 데이터 볼륨 백업, 복원 또는 마이그레이션 {#back-up-restore-or-migrate-data-volumes}

볼륨은 백업, 복원 및 마이그레이션에 유용합니다.
`--volumes-from` 플래그를 사용하여 해당 볼륨을 마운트하는 새 컨테이너를 생성할 수 있습니다.

### 볼륨 백업 {#back-up-a-volume}

예를 들어, `dbstore`라는 새 컨테이너를 생성합니다:

```console
$ docker run -v /dbdata --name dbstore ubuntu /bin/bash
```

다음 명령에서:

- 새 컨테이너를 시작하고 `dbstore` 컨테이너에서 볼륨을 마운트합니다
- 로컬 호스트 디렉토리를 `/backup`으로 마운트합니다
- `dbdata` 볼륨의 내용을 `/backup` 디렉토리 내의 `backup.tar` 파일로 tar하는 명령을 전달합니다.

```console
$ docker run --rm --volumes-from dbstore -v $(pwd):/backup ubuntu tar cvf /backup/backup.tar /dbdata
```

명령이 완료되고 컨테이너가 중지되면,
`dbdata` 볼륨의 백업이 생성됩니다.

### 백업에서 볼륨 복원 {#restore-volume-from-a-backup}

방금 생성한 백업을 사용하여 동일한 컨테이너에 복원하거나,
다른 곳에서 생성한 새 컨테이너에 복원할 수 있습니다.

예를 들어, `dbstore2`라는 새 컨테이너를 생성합니다:

```console
$ docker run -v /dbdata --name dbstore2 ubuntu /bin/bash
```

그런 다음, 새 컨테이너의 데이터 볼륨에 백업 파일을 압축 해제합니다:

```console
$ docker run --rm --volumes-from dbstore2 -v $(pwd):/backup ubuntu bash -c "cd /dbdata && tar xvf /backup/backup.tar --strip 1"
```

이 기술을 사용하여 선호하는 도구를 사용하여 백업, 마이그레이션 및 복원 테스트를 자동화할 수 있습니다.

## 볼륨 제거 {#remove-volumes}

Docker 데이터 볼륨은 컨테이너를 삭제한 후에도 지속됩니다. 고려해야 할 두 가지 유형의 볼륨이 있습니다:

- 명명된 볼륨은 컨테이너 외부의 특정 소스를 가지고 있습니다. 예를 들어, `awesome:/bar`.
- 익명 볼륨은 특정 소스가 없습니다. 따라서 컨테이너가 삭제되면 Docker 엔진 데몬에 이를 제거하도록 지시할 수 있습니다.

### 익명 볼륨 제거 {#remove-anonymous-volumes}

익명 볼륨을 자동으로 제거하려면 `--rm` 옵션을 사용하십시오. 예를 들어,
이 명령은 익명 `/foo` 볼륨을 생성합니다. 컨테이너를 제거하면,
Docker 엔진은 `/foo` 볼륨을 제거하지만 `awesome` 볼륨은 제거하지 않습니다.

```console
$ docker run --rm -v /foo -v awesome:/bar busybox top
```

:::note
다른 컨테이너가 `--volumes-from`을 사용하여 볼륨을 바인딩하면,
익명 볼륨도 첫 번째 컨테이너가 제거된 후에도 유지됩니다.
:::

### 모든 볼륨 제거 {#remove-all-volumes}

사용하지 않는 모든 볼륨을 제거하고 공간을 확보하려면:

```console
$ docker volume prune
```

## 다음 단계 {#next-steps}

- [바인드 마운트](bind-mounts.md)에 대해 알아보십시오.
- [tmpfs 마운트](tmpfs.md)에 대해 알아보십시오.
- [스토리지 드라이버](/engine/storage/drivers/)에 대해 알아보십시오.
- [서드파티 볼륨 드라이버 플러그인](/engine/extend/legacy_plugins/)에 대해 알아보십시오.