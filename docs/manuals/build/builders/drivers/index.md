---
title: 빌드 드라이버
description: 빌드 드라이버는 BuildKit 백엔드가 실행되는 방법과 위치에 대한 구성입니다.
keywords:
  - 빌드
  - buildx
  - 드라이버
  - 빌더
  - 도커-컨테이너
  - 쿠버네티스
  - 원격
aliases:
  - /build/buildx/drivers/
  - /build/building/drivers/
  - /build/buildx/multiple-builders/
  - /build/drivers/
---

빌드 드라이버는 BuildKit 백엔드가 실행되는 방법과 위치에 대한 구성입니다.
드라이버 설정은 사용자 정의가 가능하며 빌더에 대한 세밀한 제어를 허용합니다.
Buildx는 다음 드라이버를 지원합니다:

- `docker`: Docker 데몬에 번들된 BuildKit 라이브러리를 사용합니다.
- `docker-container`: Docker를 사용하여 전용 BuildKit 컨테이너를 생성합니다.
- `kubernetes`: Kubernetes 클러스터에서 BuildKit 포드를 생성합니다.
- `remote`: 수동으로 관리되는 BuildKit 데몬에 직접 연결합니다.

다른 드라이버는 다른 사용 사례를 지원합니다. 기본 `docker` 드라이버는
단순성과 사용의 용이성을 우선시합니다. 캐싱 및 출력 형식과 같은 고급 기능에 대한
지원이 제한적이며 구성할 수 없습니다. 다른 드라이버는 더 많은 유연성을 제공하며
고급 시나리오를 처리하는 데 더 적합합니다.

다음 표는 드라이버 간의 몇 가지 차이점을 설명합니다.

| 기능                          | `docker` | `docker-container` | `kubernetes` |      `remote`      |
| :--------------------------- | :------: | :----------------: | :----------: | :----------------: |
| **자동으로 이미지 로드**     |    ✅    |                    |              |                    |
| **캐시 내보내기**             |   ✓\*    |         ✅         |      ✅      |         ✅         |
| **타르볼 출력**               |          |         ✅         |      ✅      |         ✅         |
| **멀티 아치 이미지**          |          |         ✅         |      ✅      |         ✅         |
| **BuildKit 구성**             |          |         ✅         |      ✅      | 외부에서 관리됨 |

\* _`docker` 드라이버는 모든 캐시 내보내기 옵션을 지원하지 않습니다.
자세한 내용은 [캐시 저장소 백엔드](/manuals/build/cache/backends/_index.md)를 참조하십시오._

## 로컬 이미지 스토어로 로드 {#loading-to-local-image-store}

기본 `docker` 드라이버를 사용할 때와 달리, 다른 드라이버를 사용하여 빌드된 이미지는
자동으로 로컬 이미지 스토어에 로드되지 않습니다. 출력을 지정하지 않으면 빌드 결과는
빌드 캐시에만 내보내집니다.

기본이 아닌 드라이버를 사용하여 이미지를 빌드하고 이미지 스토어에 로드하려면,
빌드 명령에 `--load` 플래그를 사용하십시오:

```bash
$ docker buildx build --load -t <image> --builder=container .
...
=> oci 이미지 형식으로 내보내기                                                                                                      7.7s
=> => 레이어 내보내기                                                                                                                4.9s
=> => 매니페스트 내보내기 sha256:4e4ca161fa338be2c303445411900ebbc5fc086153a0b846ac12996960b479d3                                      0.0s
=> => 구성 내보내기 sha256:adf3eec768a14b6e183a1010cb96d91155a82fd722a1091440c88f3747f1f53f                                        0.0s
=> => 타르볼 보내기                                                                                                                 2.8s
=> 도커로 가져오기
```

이 옵션을 사용하면 빌드가 완료된 후 이미지가 이미지 스토어에 사용 가능합니다:

```bash
$ docker image ls
REPOSITORY                       TAG               IMAGE ID       CREATED             SIZE
<image>                          latest            adf3eec768a1   2 minutes ago       197MB
```

### 기본적으로 로드 {#load-by-default}

사용자 정의 빌드 드라이버를 기본 `docker` 드라이버와 유사하게 구성하여
기본적으로 이미지를 로컬 이미지 스토어에 로드할 수 있습니다.
이를 위해 빌더를 생성할 때 `default-load` 드라이버 옵션을 설정하십시오:

```bash
$ docker buildx create --driver-opt default-load=true
```

`docker` 드라이버와 마찬가지로 `--output`을 사용하여 다른 출력 형식을 지정한 경우
`--output type=docker`를 명시적으로 지정하거나 `--load` 플래그를 사용하지 않는 한
결과가 이미지 스토어에 로드되지 않습니다.

## 다음 단계 {#whats-next}

각 드라이버에 대해 읽어보십시오:

- [Docker 드라이버](./docker.md)
- [Docker 컨테이너 드라이버](./docker-container.md)
- [Kubernetes 드라이버](./kubernetes.md)
- [원격 드라이버](./remote.md)
