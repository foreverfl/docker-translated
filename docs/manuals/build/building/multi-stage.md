---
title: 다중 단계 빌드
linkTitle: Multi-stage
weight: 10
description: |
  다중 단계 빌드에 대해 배우고 이를 사용하여 빌드를 개선하고 더 작은 이미지를 얻는 방법을 알아보세요.
keywords:
  - 빌드
  - 모범 사례
aliases:
  - /engine/userguide/eng-image/multistage-build/
  - /develop/develop-images/multistage-build/
---

다중 단계 빌드는 Dockerfile을 최적화하면서 읽기 쉽고 유지 관리하기 쉽게 만드는 데 어려움을 겪은 모든 사람에게 유용합니다.

## 다중 단계 빌드 사용 {#use-multi-stage-builds}

다중 단계 빌드를 사용하면 Dockerfile에서 여러 `FROM` 문을 사용할 수 있습니다.
각 `FROM` 명령어는 다른 베이스를 사용할 수 있으며, 각 명령어는 빌드의 새로운 단계를 시작합니다.
한 단계에서 다른 단계로 선택적으로 아티팩트를 복사할 수 있으며, 최종 이미지에 원하지 않는 모든 것을 남겨둘 수 있습니다.

다음 Dockerfile에는 바이너리를 빌드하는 단계와 첫 번째 단계에서 다음 단계로 바이너리를 복사하는 두 개의 별도 단계가 있습니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:
WORKDIR /src
COPY <<EOF ./main.go
package main

import "fmt"

func main() {
  fmt.Println("hello, world")
}
EOF
RUN go build -o /bin/hello ./main.go

FROM scratch
COPY --from=0 /bin/hello /bin/hello
CMD ["/bin/hello"]
```

단일 Dockerfile만 필요합니다. 별도의 빌드 스크립트가 필요하지 않습니다. 그냥 `docker build`를 실행하세요.

```bash
$ docker build -t hello .
```

최종 결과는 바이너리만 포함된 작은 프로덕션 이미지입니다.
애플리케이션을 빌드하는 데 필요한 빌드 도구는 최종 이미지에 포함되지 않습니다.

어떻게 작동하나요? 두 번째 `FROM` 명령어는 `scratch` 이미지를 베이스로 하는 새로운 빌드 단계를 시작합니다. `COPY --from=0` 라인은 이전 단계에서 빌드된 아티팩트만 이 새로운 단계로 복사합니다. Go SDK 및 중간 아티팩트는 남겨두고 최종 이미지에 저장되지 않습니다.

## 빌드 단계 이름 지정 {#name-your-build-stages}

기본적으로 단계에는 이름이 지정되지 않으며, 첫 번째 `FROM` 명령어부터 0으로 시작하는 정수 번호로 참조합니다. 그러나 `FROM` 명령어에 `AS <NAME>`을 추가하여 단계를 이름으로 지정할 수 있습니다. 이 예제는 단계를 이름으로 지정하고 `COPY` 명령어에서 이름을 사용하여 이전 예제를 개선합니다. 이렇게 하면 Dockerfile의 명령어가 나중에 재정렬되더라도 `COPY`가 깨지지 않습니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM golang: AS build
WORKDIR /src
COPY <<EOF /src/main.go
package main

import "fmt"

func main() {
  fmt.Println("hello, world")
}
EOF
RUN go build -o /bin/hello ./main.go

FROM scratch
COPY --from=build /bin/hello /bin/hello
CMD ["/bin/hello"]
```

## 특정 빌드 단계에서 중지 {#stop-at-a-specific-build-stage}

이미지를 빌드할 때 모든 단계를 포함하여 전체 Dockerfile을 빌드할 필요는 없습니다.
대상 빌드 단계를 지정할 수 있습니다. 다음 명령어는 이전 `Dockerfile`을 사용하지만 `build`라는 이름의 단계에서 중지합니다:

```bash
$ docker build --target build -t hello .
```

이 기능이 유용할 수 있는 몇 가지 시나리오는 다음과 같습니다:

- 특정 빌드 단계 디버깅
- 모든 디버깅 심볼 또는 도구가 활성화된 `debug` 단계와 슬림한 `production` 단계 사용
- 테스트 데이터로 앱을 채우는 `testing` 단계를 사용하지만, 실제 데이터를 사용하는 다른 단계를 사용하여 프로덕션을 위해 빌드

## 외부 이미지를 단계로 사용 {#use-an-external-image-as-a-stage}

다중 단계 빌드를 사용할 때 이전에 Dockerfile에서 만든 단계에서만 복사할 필요는 없습니다.
`COPY --from` 명령어를 사용하여 별도의 이미지에서 복사할 수 있습니다. 로컬 이미지 이름, 로컬 또는 Docker 레지스트리에 있는 태그, 또는 태그 ID를 사용할 수 있습니다. Docker 클라이언트는 필요한 경우 이미지를 가져와서 거기서 아티팩트를 복사합니다. 구문은 다음과 같습니다:

```dockerfile
COPY --from=nginx:latest /etc/nginx/nginx.conf /nginx.conf
```

## 이전 단계를 새로운 단계로 사용 {#use-a-previous-stage-as-a-new-stage}

`FROM` 지시어를 사용할 때 이전 단계가 중단된 곳에서 다시 시작할 수 있습니다. 예를 들어:

```dockerfile
# syntax=docker/dockerfile:1

FROM alpine:latest AS builder
RUN apk --no-cache add build-base

FROM builder AS build1
COPY source1.cpp source.cpp
RUN g++ -o /binary source.cpp

FROM builder AS build2
COPY source2.cpp source.cpp
RUN g++ -o /binary source.cpp
```

## 레거시 빌더와 BuildKit의 차이점 {#differences-between-legacy-builder-and-buildkit}

레거시 Docker 엔진 빌더는 선택한 `--target`까지 Dockerfile의 모든 단계를 처리합니다.
선택한 대상이 해당 단계에 의존하지 않더라도 단계를 빌드합니다.

[BuildKit](../buildkit/_index.md)은 대상 단계가 의존하는 단계만 빌드합니다.

예를 들어, 다음 Dockerfile을 사용하면:

```dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu AS base
RUN echo "base"

FROM base AS stage1
RUN echo "stage1"

FROM base AS stage2
RUN echo "stage2"
```

[BuildKit 활성화](../buildkit/_index.md#getting-started) 상태에서 이 Dockerfile의 `stage2` 대상을 빌드하면 `base`와 `stage2`만 처리됩니다.
`stage1`에 대한 의존성이 없으므로 건너뜁니다.

```bash
$ DOCKER_BUILDKIT=1 docker build --no-cache -f Dockerfile --target stage2 .
[+] Building 0.4s (7/7) FINISHED
 => [internal] load build definition from Dockerfile                                            0.0s
 => => transferring dockerfile: 36B                                                             0.0s
 => [internal] load .dockerignore                                                               0.0s
 => => transferring context: 2B                                                                 0.0s
 => [internal] load metadata for docker.io/library/ubuntu:latest                                0.0s
 => CACHED [base 1/2] FROM docker.io/library/ubuntu                                             0.0s
 => [base 2/2] RUN echo "base"                                                                  0.1s
 => [stage2 1/1] RUN echo "stage2"                                                              0.2s
 => exporting to image                                                                          0.0s
 => => exporting layers                                                                         0.0s
 => => writing image sha256:f55003b607cef37614f607f0728e6fd4d113a4bf7ef12210da338c716f2cfd15    0.0s
```

반면, BuildKit 없이 동일한 대상을 빌드하면 모든 단계가 처리됩니다:

```bash
$ DOCKER_BUILDKIT=0 docker build --no-cache -f Dockerfile --target stage2 .
Sending build context to Docker daemon  219.1kB
Step 1/6 : FROM ubuntu AS base
 ---> a7870fd478f4
Step 2/6 : RUN echo "base"
 ---> Running in e850d0e42eca
base
Removing intermediate container e850d0e42eca
 ---> d9f69f23cac8
Step 3/6 : FROM base AS stage1
 ---> d9f69f23cac8
Step 4/6 : RUN echo "stage1"
 ---> Running in 758ba6c1a9a3
stage1
Removing intermediate container 758ba6c1a9a3
 ---> 396baa55b8c3
Step 5/6 : FROM base AS stage2
 ---> d9f69f23cac8
Step 6/6 : RUN echo "stage2"
 ---> Running in bbc025b93175
stage2
Removing intermediate container bbc025b93175
 ---> 09fc3770a9c4
Successfully built 09fc3770a9c4
```

레거시 빌더는 `stage2`가 `stage1`에 의존하지 않더라도 `stage1`을 처리합니다.
