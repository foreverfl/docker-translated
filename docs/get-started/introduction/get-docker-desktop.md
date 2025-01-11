---
title: Docker Desktop 설치
keywords:
  - 개념
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지에서는 Windows, Mac, Linux에 Docker Desktop을 다운로드하고 설치하는 방법을 배웁니다.
weight: 1
aliases:
  - /getting-started/get-docker-desktop/
---

<YoutubeEmbed videoId="C2bPVhiNU-0" />

## 설명 {#explanation}

Docker Desktop은 이미지를 빌드하고 컨테이너를 실행하는 등 다양한 기능을 제공하는 올인원 패키지입니다.
이 가이드는 Docker Desktop을 직접 경험할 수 있도록 설치 과정을 안내합니다.

> **Docker Desktop 이용 약관**
>
> 대기업(직원 250명 이상 또는 연간 수익 1천만 달러 이상)에서 Docker Desktop을 상업적으로 사용하려면 [유료 구독](https://www.docker.com/pricing/?_gl=1*1nyypal*_ga*MTYxMTUxMzkzOS4xNjgzNTM0MTcw*_ga_XJWPQMJYHQ*MTcxNjk4MzU4Mi4xMjE2LjEuMTcxNjk4MzkzNS4xNy4wLjA.)이 필요합니다.

<Card
  title="Mac용 Docker Desktop"
  description="macOS 샌드박스 보안 모델을 사용하는 네이티브 애플리케이션으로, 모든 Docker 도구를 Mac에 제공합니다."
  link="/desktop/setup/install/mac-install/"
  icon="/assets/images/apple_48.svg"
/>

<Card
  title="Windows용 Docker Desktop"
  description="모든 Docker 도구를 Windows 컴퓨터에 제공하는 네이티브 Windows 애플리케이션입니다."
  link="/desktop/setup/install/windows-install/"
  icon="/assets/images/windows_48.svg"
/>

<Card
  title="Linux용 Docker Desktop"
  description="모든 Docker 도구를 Linux 컴퓨터에 제공하는 네이티브 Linux 애플리케이션입니다."
  link="/desktop/setup/install/linux/"
  icon="/assets/images/linux_48.svg"
/>

설치가 완료되면 설정 과정을 완료하고 Docker 컨테이너를 실행할 준비가 됩니다.

## 시도해보기 {#try-it-out}

이 실습 가이드에서는 Docker Desktop을 사용하여 Docker 컨테이너를 실행하는 방법을 보여줍니다.

CLI를 사용하여 컨테이너를 실행하는 지침을 따르세요.

## 첫 번째 컨테이너 실행 {#run-your-first-container}

CLI 터미널을 열고 `docker run` 명령을 실행하여 컨테이너를 시작하세요:

```bash
$ docker run -d -p 8080:80 docker/welcome-to-docker
```

## 웹 페이지 접속 {#access-the-frontend}

이 컨테이너의 웹 페이지는 `8080` 포트에서 접근할 수 있습니다. 웹사이트를 열려면 브라우저에서 [http://localhost:8080](http://localhost:8080)을 방문하세요.

![실행 중인 컨테이너에서 제공하는 Nginx 웹 서버의 랜딩 페이지 스크린샷](../docker-concepts/the-basics/images/access-the-frontend.webp?border=true)

## Docker Desktop을 사용하여 컨테이너 관리 {#manage-containers-using-docker-desktop}

1. Docker Desktop을 열고 왼쪽 사이드바에서 **Containers** 필드를 선택하세요.
2. **Exec** 탭을 선택하여 로그, 파일 등의 컨테이너 정보를 확인하고 셸에 접근할 수 있습니다.

   ![Docker Desktop에서 실행 중인 컨테이너에 exec하는 스크린샷](images/exec-into-docker-container.webp?border=true)

3. **Inspect** 필드를 선택하여 컨테이너에 대한 자세한 정보를 얻을 수 있습니다. 컨테이너를 일시 중지, 재개, 시작 또는 중지하거나 **Logs**, **Bind mounts**, **Exec**, **Files**, **Stats** 탭을 탐색할 수 있습니다.

![Docker Desktop에서 실행 중인 컨테이너를 검사하는 스크린샷](images/inspecting-container.webp?border=true)

Docker Desktop은 설정, 구성 및 애플리케이션의 호환성을 간소화하여 환경 불일치 및 배포 문제를 해결함으로써 개발자가 컨테이너 관리를 쉽게 할 수 있도록 합니다.

## 다음 단계 {#whats-next}

Docker Desktop을 설치하고 첫 번째 컨테이너를 실행했으니 이제 컨테이너를 사용하여 개발을 시작할 때입니다.

<Button href="develop-with-containers">컨테이너로 개발하기</Button>
