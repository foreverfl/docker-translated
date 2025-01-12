---
title: 애플리케이션 공유
weight: 40
linkTitle: "Part 3: 애플리케이션 공유"
keywords:
  - 시작하기
  - 설정
  - 오리엔테이션
  - 빠른 시작
  - 소개
  - 개념
  - 컨테이너
  - 도커 데스크탑
  - 도커 허브
  - 공유
description: 예제 애플리케이션을 위해 빌드한 이미지를 공유하여 다른 곳에서 실행하고 다른 개발자들이 사용할 수 있도록 합니다.
aliases:
  - /get-started/part3/
  - /get-started/04_sharing_app/
  - /guides/workshop/04_sharing_app/
---

이제 이미지를 빌드했으므로 공유할 수 있습니다. Docker 이미지를 공유하려면 Docker 레지스트리를 사용해야 합니다. 기본 레지스트리는 Docker Hub이며, 지금까지 사용한 모든 이미지는 여기에서 가져온 것입니다.

> **Docker ID**
>
> Docker ID를 사용하면 세계 최대의 컨테이너 이미지 라이브러리 및 커뮤니티인 Docker Hub에 액세스할 수 있습니다. Docker ID가 없으면 무료로 [Docker ID](https://hub.docker.com/signup)를 만드세요.

## 리포지토리 생성 {#Create-a-repository}

이미지를 푸시하려면 먼저 Docker Hub에서 리포지토리를 생성해야 합니다.

1. [가입](https://www.docker.com/pricing?utm_source=docker&utm_medium=webreferral&utm_campaign=docs_driven_upgrade)하거나 [Docker Hub](https://hub.docker.com)에 로그인합니다.

2. **Create Repository** 버튼을 선택합니다.

3. 리포지토리 이름으로 `getting-started`를 사용합니다. **Visibility**는 **Public**으로 설정합니다.

4. **Create**를 선택합니다.

다음 이미지는 Docker Hub에서 Docker 명령어 예제를 보여줍니다. 이 명령어는 이 리포지토리에 푸시합니다.

![Docker command with push example](images/push-command.webp)

## 이미지 푸시 {#Push-the-image}

1. 명령줄에서 Docker Hub에 표시된 `docker push` 명령어를 실행합니다. 명령어에 "docker"가 아닌 자신의 Docker ID가 포함되어야 합니다. 예를 들어, `docker push YOUR-USER-NAME/getting-started`.

   ```bash
   $ docker push docker/getting-started
   The push refers to repository [docker.io/docker/getting-started]
   An image does not exist locally with the tag: docker/getting-started
   ```

   왜 실패했을까요? 푸시 명령어는 `docker/getting-started`라는 이름의 이미지를 찾고 있었지만 찾지 못했습니다. `docker image ls`를 실행해도 해당 이미지를 찾을 수 없습니다.

   이를 해결하려면 빌드한 기존 이미지에 새 이름을 태그해야 합니다.

2. `docker login -u YOUR-USER-NAME` 명령어를 사용하여 Docker Hub에 로그인합니다.

3. `docker tag` 명령어를 사용하여 `getting-started` 이미지에 새 이름을 부여합니다. `YOUR-USER-NAME`을 자신의 Docker ID로 바꿉니다.

   ```bash
   $ docker tag getting-started YOUR-USER-NAME/getting-started
   ```

4. 이제 `docker push` 명령어를 다시 실행합니다. Docker Hub에서 값을 복사하는 경우, 이미지 이름에 태그를 추가하지 않았으므로 `tagname` 부분을 생략할 수 있습니다. 태그를 지정하지 않으면 Docker는 `latest`라는 태그를 사용합니다.

   ```bash
   $ docker push YOUR-USER-NAME/getting-started
   ```

## 새 인스턴스에서 이미지 실행 {#Run-the-image-on-a-new-instance}

이제 이미지를 빌드하고 레지스트리에 푸시했으므로 이 컨테이너 이미지를 본 적이 없는 새 인스턴스에서 애플리케이션을 실행해 보세요. 이를 위해 Play with Docker를 사용합니다.

:::note
Play with Docker는 amd64 플랫폼을 사용합니다. Apple Silicon을 사용하는 ARM 기반 Mac을 사용하는 경우, Play with Docker와 호환되도록 이미지를 다시 빌드하고 새 이미지를 리포지토리에 푸시해야 합니다.

amd64 플랫폼용 이미지를 빌드하려면 `--platform` 플래그를 사용합니다.

```bash
$ docker build --platform linux/amd64 -t YOUR-USER-NAME/getting-started .
```

Docker buildx는 다중 플랫폼 이미지를 빌드하는 것도 지원합니다. 자세한 내용은 [다중 플랫폼 이미지](/manuals/build/building/multi-platform.md)를 참조하세요.
:::

1. 브라우저를 열고 [Play with Docker](https://labs.play-with-docker.com/)로 이동합니다.

2. **Login**을 선택한 다음 드롭다운 목록에서 **docker**를 선택합니다.

3. Docker Hub 계정으로 로그인한 다음 **Start**를 선택합니다.

4. 왼쪽 사이드바에서 **ADD NEW INSTANCE** 옵션을 선택합니다. 보이지 않으면 브라우저 창을 조금 넓게 만드세요. 몇 초 후 브라우저에 터미널 창이 열립니다.

   ![Play with Docker add new instance](images/pwd-add-new-instance.webp)

5. 터미널에서 새로 푸시한 애플리케이션을 시작합니다.

   ```bash
   $ docker run -dp 0.0.0.0:3000:3000 YOUR-USER-NAME/getting-started
   ```

   이미지를 다운로드하고 결국 시작되는 것을 볼 수 있습니다.

   :::tip
   이 명령어가 포트 매핑을 다른 IP 주소에 바인딩하는 것을 눈치챘을 것입니다. 이전 `docker run` 명령어는 호스트의 `127.0.0.1:3000`에 포트를 게시했습니다. 이번에는 `0.0.0.0`을 사용합니다.

   `127.0.0.1`에 바인딩하면 컨테이너의 포트가 루프백 인터페이스에만 노출됩니다. 그러나 `0.0.0.0`에 바인딩하면 호스트의 모든 인터페이스에 컨테이너의 포트가 노출되어 외부 세계에 접근할 수 있게 됩니다.

   포트 매핑 작동 방식에 대한 자세한 내용은 [네트워킹](/manuals/engine/network/_index.md#published-ports)을 참조하세요.
   :::

6. 3000 배지가 나타나면 선택합니다.

   3000 배지가 나타나지 않으면 **Open Port**를 선택하고 `3000`을 지정할 수 있습니다.

## 요약 {#Summary}

이 섹션에서는 이미지를 레지스트리에 푸시하여 공유하는 방법을 배웠습니다. 그런 다음 새 인스턴스로 이동하여 새로 푸시된 이미지를 실행할 수 있었습니다. 이는 CI 파이프라인에서 매우 일반적입니다. 파이프라인은 이미지를 생성하고 레지스트리에 푸시한 다음 프로덕션 환경에서 최신 버전의 이미지를 사용할 수 있습니다.

관련 정보:

- [docker CLI 참조](/reference/cli/docker/)
- [다중 플랫폼 이미지](/manuals/build/building/multi-platform.md)
- [Docker Hub 개요](/manuals/docker-hub/_index.md)

## 다음 단계 {#Next-steps}

다음 섹션에서는 컨테이너화된 애플리케이션에서 데이터를 지속하는 방법을 배웁니다.

<Button href="05_persisting_data.md">DB 지속성</Button>
