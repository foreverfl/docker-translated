---
title: Dockerfile 작성하기
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지에서는 Dockerfile을 사용하여 이미지를 만드는 방법을 배웁니다.
summary: |
  Mastering Dockerfile practices is vital for leveraging container technology
  effectively, enhancing application reliability and supporting DevOps and
  CI/CD methodologies. In this guide, you’ll learn how to write a Dockerfile,
  how to define a base image and setup instructions, including software
  installation and copying necessary files.
weight: 2
aliases:
  - /guides/docker-concepts/building-images/writing-a-dockerfile/
---

<YoutubeEmbed videoId="Jx8zoIhiP4c" />

## 설명 {#Explanation}

Dockerfile은 컨테이너 이미지를 생성하는 데 사용되는 텍스트 기반 문서입니다. 이미지 빌더에게 실행할 명령, 복사할 파일, 시작 명령 등을 지시합니다.

다음 Dockerfile 예제는 실행 준비가 된 Python 애플리케이션을 생성합니다:

```dockerfile
FROM python:3.12
WORKDIR /usr/local/app

# 애플리케이션 종속성 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY src ./src
EXPOSE 5000

# 컨테이너가 루트 사용자로 실행되지 않도록 앱 사용자 설정
RUN useradd app
USER app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

### 일반적인 명령어 {#Common-instructions}

`Dockerfile`에서 가장 일반적인 명령어는 다음과 같습니다:

- `FROM <image>` - 빌드가 확장할 기본 이미지를 지정합니다.
- `WORKDIR <path>` - 이 명령어는 파일이 복사되고 명령이 실행될 이미지의 "작업 디렉토리" 또는 경로를 지정합니다.
- `COPY <host-path> <image-path>` - 이 명령어는 호스트에서 파일을 복사하여 컨테이너 이미지에 넣도록 빌더에게 지시합니다.
- `RUN <command>` - 이 명령어는 지정된 명령을 실행하도록 빌더에게 지시합니다.
- `ENV <name> <value>` - 이 명령어는 실행 중인 컨테이너가 사용할 환경 변수를 설정합니다.
- `EXPOSE <port-number>` - 이 명령어는 이미지가 노출하려는 포트를 나타내는 설정을 이미지에 설정합니다.
- `USER <user-or-uid>` - 이 명령어는 모든 후속 명령어에 대한 기본 사용자를 설정합니다.
- `CMD ["<command>", "<arg1>"]` - 이 명령어는 이 이미지를 사용하는 컨테이너가 실행할 기본 명령을 설정합니다.

모든 명령어를 읽거나 자세히 알아보려면 [Dockerfile 참조](https://docs.docker.com/engine/reference/builder/)를 확인하세요.

## 직접 해보기 {#Try-it-out}

이전 예제에서 본 것처럼, Dockerfile은 일반적으로 다음 단계를 따릅니다:

1. 기본 이미지 결정
2. 애플리케이션 종속성 설치
3. 관련 소스 코드 및/또는 바이너리 복사
4. 최종 이미지 구성

이 빠른 실습 가이드에서는 간단한 Node.js 애플리케이션을 빌드하는 Dockerfile을 작성합니다. JavaScript 기반 애플리케이션에 익숙하지 않더라도 걱정하지 마세요. 이 가이드를 따라가는 데 필요하지 않습니다.

### 설정 {#Set-up}

[이 ZIP 파일을 다운로드](https://github.com/docker/getting-started-todo-app/raw/build-image-from-scratch/app.zip)하고 내용을 로컬 디렉토리에 추출하세요.

### Dockerfile 작성하기 {#Creating-the-Dockerfile}

이제 프로젝트를 준비했으므로 `Dockerfile`을 작성할 준비가 되었습니다.

1. [Docker Desktop을 다운로드하고 설치](https://www.docker.com/products/docker-desktop/)하세요.

2. `package.json` 파일과 동일한 폴더에 `Dockerfile`이라는 파일을 만드세요.

   > **Dockerfile 파일 확장자**
   >
   > `Dockerfile`에는 파일 확장자가 *없음*을 유의하세요. 일부 편집기는 파일에 확장자를 자동으로 추가하거나 확장자가 없다고 불평할 수 있습니다.

3. `Dockerfile`에서 다음 줄을 추가하여 기본 이미지를 정의하세요:

   ```dockerfile
   FROM node:20-alpine
   ```

4. 이제 `WORKDIR` 명령어를 사용하여 작업 디렉토리를 정의하세요. 이는 향후 명령이 실행될 위치와 컨테이너 이미지 내부에 파일이 복사될 디렉토리를 지정합니다.

   ```dockerfile
   WORKDIR /app
   ```

5. `COPY` 명령어를 사용하여 로컬 머신의 프로젝트 파일을 모두 컨테이너 이미지에 복사하세요:

   ```dockerfile
   COPY . .
   ```

6. `yarn` CLI 및 패키지 관리자를 사용하여 앱의 종속성을 설치하세요. 이를 위해 `RUN` 명령어를 사용하여 명령을 실행하세요:

   ```dockerfile
   RUN yarn install --production
   ```

7. 마지막으로 `CMD` 명령어를 사용하여 실행할 기본 명령을 지정하세요:

   ```dockerfile
   CMD ["node", "./src/index.js"]
   ```

   이렇게 하면 다음과 같은 Dockerfile이 생성됩니다:

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY . .
   RUN yarn install --production
   CMD ["node", "./src/index.js"]
   ```

> **이 Dockerfile은 아직 프로덕션 준비가 되지 않았습니다**
>
> 이 Dockerfile은 아직 모든 모범 사례를 따르지 _않습니다_ (의도적으로). 애플리케이션을 빌드할 수는 있지만, 빌드 속도가 빠르거나 이미지가 안전하지 않을 수 있습니다.
>
> 빌드 캐시를 최대화하고, 루트 사용자가 아닌 사용자로 실행하며, 다단계 빌드를 사용하는 방법에 대해 더 알아보세요.

> **`docker init`으로 새 프로젝트를 빠르게 컨테이너화**
>
> `docker init` 명령어는 프로젝트를 분석하고 Dockerfile, `compose.yaml`, `.dockerignore`를 빠르게 생성하여 빠르게 시작할 수 있도록 도와줍니다. 여기서는 Dockerfile에 대해 배우고 있으므로 지금은 사용하지 않습니다. 하지만, [여기에서 더 알아보세요](/engine/reference/commandline/init/).

## 추가 자료 {#Additional-resources}

Dockerfile 작성에 대해 더 알아보려면 다음 자료를 방문하세요:

- [Dockerfile 참조](/reference/dockerfile/)
- [Dockerfile 모범 사례](/develop/develop-images/dockerfile_best-practices/)
- [기본 이미지](/build/building/base-images/)
- [Docker Init 시작하기](/reference/cli/docker/init/)

## 다음 단계 {#Next-steps}

이제 Dockerfile을 작성하고 기본 사항을 배웠으므로, 빌드, 태그 및 이미지를 푸시하는 방법을 배울 차례입니다.

<Button href="build-tag-and-publish-an-image">이미지 빌드, 태그 및 게시</Button>
