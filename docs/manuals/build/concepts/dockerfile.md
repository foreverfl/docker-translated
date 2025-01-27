---
title: Dockerfile 개요
weight: 20
description: Dockerfile 및 Docker 이미지를 사용하여 소프트웨어를 빌드하고 패키징하는 방법을 알아보세요
keywords:
  - 빌드
  - buildx
  - buildkit
  - 시작하기
  - dockerfile
aliases:
- /build/hellobuild/
- /build/building/packaging/
---

## Dockerfile {#dockerfile}

모든 것은 Dockerfile에서 시작됩니다.

Docker는 Dockerfile의 지침을 읽어 이미지를 빌드합니다. Dockerfile은 소스 코드를 빌드하기 위한 지침이 포함된 텍스트 파일입니다. Dockerfile 지침 구문은 [Dockerfile 참조](/reference/dockerfile.md)에 정의되어 있습니다.

다음은 가장 일반적인 지침 유형입니다:

| 지침                                                              | 설명                                                                                                                                                                                              |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`FROM <image>`](/reference/dockerfile.md#from)           | 이미지의 기본을 정의합니다.                                                                                                                                                                           |
| [`RUN <command>`](/reference/dockerfile.md#run)           | 현재 이미지 위에 새로운 레이어에서 명령을 실행하고 결과를 커밋합니다. `RUN`은 명령을 실행하기 위한 셸 형식도 있습니다.                                                               |
| [`WORKDIR <directory>`](/reference/dockerfile.md#workdir) | Dockerfile에서 뒤따르는 모든 `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD` 지침에 대한 작업 디렉토리를 설정합니다.                                                                          |
| [`COPY <src> <dest>`](/reference/dockerfile.md#copy)      | 새로운 파일이나 디렉토리를 `<src>`에서 복사하여 컨테이너의 파일 시스템에 `<dest>` 경로로 추가합니다.                                                                                      |
| [`CMD <command>`](/reference/dockerfile.md#cmd)           | 이 이미지를 기반으로 컨테이너를 시작할 때 실행되는 기본 프로그램을 정의합니다. 각 Dockerfile에는 하나의 `CMD`만 있으며, 여러 개가 존재할 경우 마지막 `CMD` 인스턴스만 존중됩니다. |

Dockerfile은 이미지 빌드의 중요한 입력이며 고유한 구성에 따라 자동화된 다중 레이어 이미지 빌드를 용이하게 할 수 있습니다. Dockerfile은 간단하게 시작하여 더 복잡한 시나리오를 지원하기 위해 필요에 따라 성장할 수 있습니다.

### 파일 이름 {#filename}

Dockerfile의 기본 파일 이름은 파일 확장자가 없는 `Dockerfile`입니다. 기본 이름을 사용하면 추가 명령 플래그를 지정하지 않고 `docker build` 명령을 실행할 수 있습니다.

일부 프로젝트는 특정 목적을 위한 별도의 Dockerfile이 필요할 수 있습니다. 일반적인 관례는 이러한 파일을 `<something>.Dockerfile`로 명명하는 것입니다. `docker build` 명령의 `--file` 플래그를 사용하여 Dockerfile 파일 이름을 지정할 수 있습니다. `--file` 플래그에 대해 자세히 알아보려면 [`docker build` CLI 참조](/reference/cli/docker/buildx/build.md#file)를 참조하세요.

:::note
프로젝트의 주요 Dockerfile에는 기본값(`Dockerfile`)을 사용하는 것이 좋습니다.
:::

## Docker 이미지 {#docker-images}

Docker 이미지는 레이어로 구성됩니다. 각 레이어는 Dockerfile의 빌드 지침의 결과입니다. 레이어는 순차적으로 쌓이며 각 레이어는 이전 레이어에 적용된 변경 사항을 나타내는 델타입니다.

### 예제 {#example}

다음은 Docker를 사용하여 애플리케이션을 빌드하는 일반적인 워크플로우입니다.

다음 예제 코드는 Flask 프레임워크를 사용하여 작성된 작은 "Hello World" 애플리케이션을 보여줍니다.

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"
```

Docker Build 없이 이 애플리케이션을 배포하고 실행하려면 다음을 확인해야 합니다:

- 필요한 런타임 종속성이 서버에 설치되어 있습니다.
- Python 코드가 서버의 파일 시스템에 업로드됩니다.
- 서버가 필요한 매개변수를 사용하여 애플리케이션을 시작합니다.

다음 Dockerfile은 모든 종속성이 설치된 컨테이너 이미지를 생성하며 애플리케이션을 자동으로 시작합니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu:22.04

# 앱 종속성 설치
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip install flask==3.0.*

# 앱 설치
COPY hello.py /

# 최종 구성
ENV FLASK_APP=hello
EXPOSE 8000
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "8000"]
```

이 Dockerfile이 수행하는 작업은 다음과 같습니다:

- [Dockerfile 구문](#dockerfile-syntax)
- [기본 이미지](#base-image)
- [환경 설정](#environment-setup)
- [주석](#comments)
- [종속성 설치](#installing-dependencies)
- [파일 복사](#copying-files)
- [환경 변수 설정](#setting-environment-variables)
- [노출된 포트](#exposed-ports)
- [애플리케이션 시작](#starting-the-application)

### Dockerfile 구문 {#dockerfile-syntax}

Dockerfile에 추가할 첫 번째 줄은 [`# syntax` 파서 지시문](/reference/dockerfile.md#syntax)입니다. 선택 사항이지만, 이 지시문은 Docker 빌더에게 Dockerfile을 구문 분석할 때 사용할 구문을 지시하며, [BuildKit이 활성화된](../buildkit/_index.md#getting-started) 이전 Docker 버전이 빌드를 시작하기 전에 특정 [Dockerfile 프론트엔드](../buildkit/frontend.md)를 사용할 수 있도록 합니다. [파서 지시문](/reference/dockerfile.md#parser-directives)은 Dockerfile의 다른 주석, 공백 또는 지침보다 먼저 나타나야 하며 Dockerfile의 첫 번째 줄이어야 합니다.

```dockerfile
# syntax=docker/dockerfile:1
```

:::tip
`docker/dockerfile:1`을 사용하는 것이 좋습니다. 이는 항상 버전 1 구문의 최신 릴리스를 가리킵니다. BuildKit은 빌드 전에 구문 업데이트를 자동으로 확인하여 최신 버전을 사용하고 있는지 확인합니다.
:::

### 기본 이미지 {#base-image}

구문 지시문 다음 줄은 사용할 기본 이미지를 정의합니다:

```dockerfile
FROM ubuntu:22.04
```

[`FROM` 지침](/reference/dockerfile.md#from)은 기본 이미지를 Ubuntu 22.04 릴리스로 설정합니다. 그 뒤에 오는 모든 지침은 이 기본 이미지, 즉 Ubuntu 환경에서 실행됩니다. `ubuntu:22.04` 표기법은 Docker 이미지 이름 지정의 `name:tag` 표준을 따릅니다. 이미지를 빌드할 때 이 표기법을 사용하여 이미지를 이름 짓습니다. 많은 공개 이미지를 프로젝트에서 활용할 수 있으며, Dockerfile `FROM` 지침을 사용하여 빌드 단계에 가져올 수 있습니다.

[Docker Hub](https://hub.docker.com/search?image_filter=official&q=&type=image)에는 이 목적을 위해 사용할 수 있는 많은 공식 이미지가 포함되어 있습니다.

### 환경 설정 {#environment-setup}

다음 줄은 기본 이미지 내에서 빌드 명령을 실행합니다.

```dockerfile
# 앱 종속성 설치
RUN apt-get update && apt-get install -y python3 python3-pip
```

이 [`RUN` 지침](/reference/dockerfile.md#run)은 Ubuntu에서 셸을 실행하여 APT 패지지 인덱스를 업데이트하고 컨테이너에 Python 도구를 설치합니다.

### 주석 {#comments}

`# 앱 종속성 설치` 줄을 주목하세요. 이것은 주석입니다. Dockerfile의 주석은 `#` 기호로 시작합니다. Dockerfile이 발전함에 따라 주석은 파일의 작동 방식을 문서화하는 데 유용할 수 있으며, 미래의 독자와 편집자, 그리고 미래의 자신에게도 유용할 수 있습니다!

:::note
주석이 파일의 첫 번째 줄에 있는 [구문 지시문](#dockerfile-syntax)과 동일한 기호를 사용하여 표시된 것을 눈치챘을 것입니다. 패턴이 지시문과 일치하고 Dockerfile의 시작 부분에 나타나는 경우에만 지시문으로 해석됩니다. 그렇지 않으면 주석으로 처리됩니다.
:::

### 종속성 설치 {#installing-dependencies}

두 번째 `RUN` 지침은 Python 애플리케이션에 필요한 `flask` 종속성을 설치합니다.

```dockerfile
RUN pip install flask==3.0.*
```

이 지침의 전제 조건은 `pip`이 빌드 컨테이너에 설치되어 있어야 한다는 것입니다. 첫 번째 `RUN` 명령은 `pip`을 설치하여 flask 웹 프레임워크를 설치할 수 있도록 합니다.

### 파일 복사 {#copying-files}

다음 지침은 [`COPY` 지침](/reference/dockerfile.md#copy)을 사용하여 로컬 빌드 컨텍스트에서 `hello.py` 파일을 이미지의 루트 디렉토리로 복사합니다.

```dockerfile
COPY hello.py /
```

[빌드 컨텍스트](./context.md)는 `COPY` 및 `ADD`와 같은 Dockerfile 지침에서 액세스할 수 있는 파일 집합입니다.

`COPY` 지침 후에 `hello.py` 파일이 빌드 컨테이너의 파일 시스템에 추가됩니다.

### 환경 변수 설정 {#setting-environment-variables}

애플리케이션이 환경 변수를 사용하는 경우 [`ENV` 지침](/reference/dockerfile.md#env)을 사용하여 Docker 빌드에서 환경 변수를 설정할 수 있습니다.

```dockerfile
ENV FLASK_APP=hello
```

이는 나중에 필요할 Linux 환경 변수를 설정합니다. 이 예제에서 사용된 Flask 프레임워크는 이 변수를 사용하여 애플리케이션을 시작합니다. 이 변수가 없으면 flask는 애플리케이션을 실행할 위치를 알 수 없습니다.

### 노출된 포트 {#exposed-ports}

[`EXPOSE` 지침](/reference/dockerfile.md#expose)은 최종 이미지에 포트 `8000`에서 서비스가 수신 대기 중임을 나타냅니다.

```dockerfile
EXPOSE 8000
```

이 지침은 필수는 아니지만, 도구와 팀 구성원이 이 애플리케이션이 무엇을 하는지 이해하는 데 도움이 되므로 좋은 관행입니다.

### 애플리케이션 시작 {#starting-the-application}

마지막으로 [`CMD` 지침](/reference/dockerfile.md#cmd)은 이 이미지를 기반으로 컨테이너를 시작할 때 실행되는 명령을 설정합니다.

```dockerfile
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "8000"]
```

이 명령은 모든 주소에서 포트 `8000`에서 수신 대기하는 flask 개발 서버를 시작합니다. 여기서 사용된 예제는 `CMD`의 "exec 형식" 버전입니다. "셸 형식"을 사용하는 것도 가능합니다:

```dockerfile
CMD flask run --host 0.0.0.0 --port 8000
```

이 두 버전 간에는 미묘한 차이가 있으며, 예를 들어 `SIGTERM` 및 `SIGKILL`과 같은 신호를 포착하는 방식에서 차이가 있습니다. 이러한 차이에 대한 자세한 내용은 [셸 및 exec 형식](/reference/dockerfile.md#shell-and-exec-form)을 참조하세요.

## 빌드 {#building}

[이전 섹션](#example)의 Dockerfile 예제를 사용하여 컨테이너 이미지를 빌드하려면 `docker build` 명령을 사용합니다:

```console
$ docker build -t test:latest .
```

`-t test:latest` 옵션은 이미지의 이름과 태그를 지정합니다.

명령 끝의 단일 점(`.`)은 빌드 컨텍스트를 현재 디렉토리로 설정합니다. 이는 빌드가 명령이 실행되는 디렉토리에서 Dockerfile과 `hello.py` 파일을 찾기를 기대한다는 의미입니다. 해당 파일이 없으면 빌드가 실패합니다.

이미지가 빌드된 후 `docker run`을 사용하여 이미지 이름을 지정하여 애플리케이션을 컨테이너로 실행할 수 있습니다:

```console
$ docker run -p 127.0.0.1:8000:8000 test:latest
```

이 명령은 컨테이너의 포트 8000을 Docker 호스트의 `http://localhost:8000`에 게시합니다.
