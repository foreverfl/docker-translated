---
title: 빌더 관리
keywords:
  - 빌드
  - buildx
  - 빌더
  - buildkit
  - 드라이버
  - 백엔드
---

`docker buildx` 명령어를 사용하거나 [Docker Desktop을 사용하여](#manage-builders-with-docker-desktop) 빌더를 생성, 검사 및 관리할 수 있습니다.

## 새로운 빌더 생성 {#create-a-new-builder}

기본 빌더는 [`docker` 드라이버](drivers/docker.md)를 사용합니다.
새로운 `docker` 빌더를 수동으로 생성할 수는 없지만,
BuildKit 데몬을 컨테이너에서 실행하는
[`docker-container` 드라이버](drivers/docker-container.md)와 같은 다른 드라이버를 사용하는 빌더를 생성할 수 있습니다.

[`docker buildx create`](/reference/cli/docker/buildx/create.md) 명령어를 사용하여 빌더를 생성합니다.

```bash
$ docker buildx create --name=<builder-name>
```

`--driver` 플래그를 생략하면 Buildx는 기본적으로 `docker-container` 드라이버를 사용합니다. 사용 가능한 드라이버에 대한 자세한 내용은 [빌드 드라이버](drivers/_index.md)를 참조하십시오.

## 사용 가능한 빌더 목록 {#list-available-builders}

시스템에서 사용 가능한 빌더 인스턴스와 그들이 사용하는 드라이버를 보려면 `docker buildx ls`를 사용하십시오.

```bash
$ docker buildx ls
NAME/NODE       DRIVER/ENDPOINT      STATUS   BUILDKIT PLATFORMS
default *       docker
  default       default              running  v0.11.6  linux/amd64, linux/amd64/v2, linux/amd64/v3, linux/386
my_builder      docker-container
  my_builder0   default              running  v0.11.6  linux/amd64, linux/amd64/v2, linux/amd64/v3, linux/386
```

빌더 이름 옆의 별표(`*`)는 [선택된 빌더](_index.md#selected-builder)를 나타냅니다.

## 빌더 검사 {#inspect-a-builder}

CLI를 사용하여 빌더를 검사하려면 `docker buildx inspect <name>`을 사용하십시오.
빌더가 활성 상태일 때만 빌더를 검사할 수 있습니다.
`--bootstrap` 플래그를 명령어에 추가하여 빌더를 시작할 수 있습니다.

```bash
$ docker buildx inspect --bootstrap my_builder
[+] Building 1.7s (1/1) FINISHED
 => [internal] booting buildkit                                                              1.7s
 => => pulling image moby/buildkit:buildx-stable-1                                           1.3s
 => => creating container buildx_buildkit_my_builder0                                        0.4s
Name:          my_builder
Driver:        docker-container
Last Activity: 2023-06-21 18:28:37 +0000 UTC

Nodes:
Name:      my_builder0
Endpoint:  unix:///var/run/docker.sock
Status:    running
Buildkit:  v0.11.6
Platforms: linux/arm64, linux/amd64, linux/amd64/v2, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/mips64le, linux/mips64, linux/arm/v7, linux/arm/v6
```

빌더가 사용하는 디스크 공간을 확인하려면 `docker buildx du` 명령어를 사용하십시오. 기본적으로 이 명령어는 사용 가능한 모든 빌더의 총 디스크 사용량을 표시합니다. 특정 빌더의 사용량을 보려면 `--builder` 플래그를 사용하십시오.

```bash
$ docker buildx du --builder my_builder
ID                                        RECLAIMABLE SIZE        LAST ACCESSED
olkri5gq6zsh8q2819i69aq6l                 true        797.2MB     37 seconds ago
6km4kasxgsywxkm6cxybdumbb*                true        438.5MB     36 seconds ago
qh3wwwda7gx2s5u4hsk0kp4w7                 true        213.8MB     37 seconds ago
54qq1egqem8max3lxq6180cj8                 true        200.2MB     37 seconds ago
ndlp969ku0950bmrw9muolw0c*                true        116.7MB     37 seconds ago
u52rcsnfd1brwc0chwsesb3io*                true        116.7MB     37 seconds ago
rzoeay0s4nmss8ub59z6lwj7d                 true        46.25MB     4 minutes ago
itk1iibhmv7awmidiwbef633q                 true        33.33MB     37 seconds ago
4p78yqnbmgt6xhcxqitdieeln                 true        19.46MB     4 minutes ago
dgkjvv4ay0szmr9bl7ynla7fy*                true        19.24MB     36 seconds ago
tuep198kmcw299qc9e4d1a8q2                 true        8.663MB     4 minutes ago
n1wzhauk9rpmt6ib1es7dktvj                 true        20.7kB      4 minutes ago
0a2xfhinvndki99y69157udlm                 true        16.56kB     37 seconds ago
gf0z1ypz54npfererqfeyhinn                 true        16.38kB     37 seconds ago
nz505f12cnsu739dw2pw0q78c                 true        8.192kB     37 seconds ago
hwpcyq5hdfvioltmkxu7fzwhb*                true        8.192kB     37 seconds ago
acekq89snc7j6im1rjdizvsg1*                true        8.192kB     37 seconds ago
Reclaimable:  2.01GB
Total:        2.01GB
```

## 빌더 제거 {#remove-a-builder}

[`docker buildx remove`](/reference/cli/docker/buildx/create.md) 명령어를 사용하여 빌더를 제거합니다.

```bash
$ docker buildx rm <builder-name>
```

현재 선택된 빌더를 제거하면 기본 `docker` 빌더가 자동으로 선택됩니다.
기본 빌더는 제거할 수 없습니다.

빌더의 로컬 빌드 캐시도 제거됩니다.

### 원격 빌더 제거 {#removing-remote-builders}

원격 빌더를 제거해도 원격 빌드 캐시에는 영향을 미치지 않습니다.
또한 원격 BuildKit 데몬을 중지하지 않습니다.
빌더에 대한 연결만 제거됩니다.

## Docker Desktop으로 빌더 관리 {#manage-builders-with-docker-desktop}

[Docker Desktop 빌드 보기](/manuals/desktop/use-desktop/builds.md)를 켠 경우, [Docker Desktop 설정](/manuals/desktop/settings-and-maintenance/settings.md#builders)에서 빌더를 검사할 수 있습니다.
