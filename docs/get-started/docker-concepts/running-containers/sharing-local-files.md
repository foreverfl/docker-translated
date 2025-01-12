---
title: 컨테이너와 로컬 파일 공유
weight: 4
keywords:
  - 개념
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지에서는 Docker에서 사용할 수 있는 다양한 스토리지 옵션과 그 일반적인 사용법을 배웁니다.
aliases:
  - /guides/docker-concepts/running-containers/sharing-local-files/
---

<YoutubeEmbed videoId="2dAzsVg3Dek" />

## 설명 {#explanation}

각 컨테이너는 호스트 머신에 사전 설치된 종속성에 의존하지 않고 기능하는 데 필요한 모든 것을 갖추고 있습니다. 컨테이너는 격리된 상태로 실행되므로 호스트 및 다른 컨테이너에 미치는 영향이 최소화됩니다. 이러한 격리는 컨테이너는 호스트 시스템 및 다른 컨테이너와의 충돌을 최소화하는 이점을 제공합니다. 그러나 이러한 격리는 기본적으로 컨테이너가 호스트 머신의 데이터에 직접 액세스할 수 없음을 의미합니다.

웹 애플리케이션 컨테이너가 호스트 시스템에 저장된 구성 설정 파일에 액세스해야 하는 시나리오를 고려해 보십시오. 이 파일에는 데이터베이스 자격 증명이나 API 키와 같은 민감한 데이터가 포함될 수 있습니다. 이러한 민감한 정보를 컨테이너 이미지에 직접 저장하면 이미지 공유 중 보안 위험이 발생할 수 있습니다. 이 문제를 해결하기 위해 Docker는 컨테이너 격리와 호스트 머신의 데이터 간의 격차를 해소하는 스토리지 옵션을 제공합니다.

Docker는 데이터를 지속하고 호스트 머신과 컨테이너 간에 파일을 공유하기 위한 볼륨과 바인드 마운트라는 두 가지 주요 스토리지 옵션을 제공합니다:

### 볼륨 대 바인드 마운트 {#volume-versus-bind-mounts}

컨테이너가 중지된 후에도 컨테이너 내부에서 생성되거나 수정된 데이터가 유지되도록 하려면 볼륨을 선택해야 합니다. 볼륨과 그 사용 사례에 대해 자세히 알아보려면 [컨테이너 데이터 유지](/get-started/docker-concepts/running-containers/persisting-container-data/)를 참조하십시오.

호스트 시스템에 있는 특정 파일이나 디렉토리를 컨테이너와 직접 공유하려면 바인드 마운트를 사용합니다. 이는 호스트와 컨테이너 간의 직접적인 포털을 여는 것과 같습니다. 바인드 마운트는 실시간 파일 액세스 및 공유가 중요한 개발 환경에 이상적입니다.

### 호스트와 컨테이너 간 파일 공유 {#sharing-files-between-a-host-and-container}

`docker run` 명령어와 함께 사용되는 `-v` (또는 `--volume`) 및 `--mount` 플래그는 로컬 머신(호스트)과 Docker 컨테이너 간에 파일이나 디렉토리를 공유할 수 있게 해줍니다. 그러나 이들의 동작과 사용법에는 몇 가지 중요한 차이점이 있습니다.

`-v` 플래그는 기본적인 볼륨 또는 바인드 마운트 작업에 더 간단하고 편리합니다. `-v` 또는 `--volume`을 사용할 때 호스트 위치가 존재하지 않으면 디렉토리가 자동으로 생성됩니다.

개발자가 프로젝트를 작업하고 있다고 상상해 보십시오. 개발 머신에 소스 디렉토리가 있고, 코드가 저장되어 있습니다. 코드를 컴파일하거나 빌드할 때 생성된 아티팩트(컴파일된 코드, 실행 파일, 이미지 등)는 소스 디렉토리 내의 별도 하위 디렉토리에 저장됩니다. 다음 예제에서 이 하위 디렉토리는 `/HOST/PATH`입니다. 이제 이 빌드 아티팩트를 애플리케이션을 실행하는 Docker 컨테이너 내에서 액세스할 수 있도록 하고 싶습니다. 또한 코드를 다시 빌드할 때마다 컨테이너가 최신 빌드 아티팩트에 자동으로 액세스할 수 있도록 하고 싶습니다.

다음은 바인드 마운트를 사용하여 컨테이너 파일 위치에 매핑하는 방법입니다.

```bash
$ docker run -v /HOST/PATH:/CONTAINER/PATH -it nginx
```

`--mount` 플래그는 더 고급 기능과 세밀한 제어를 제공하여 복잡한 마운트 시나리오나 프로덕션 배포에 적합합니다. `--mount`를 사용하여 Docker 호스트에 아직 존재하지 않는 파일이나 디렉토리를 바인드 마운트하면 `docker run` 명령어가 자동으로 생성하지 않고 오류를 발생시킵니다.

```bash
$ docker run --mount type=bind,source=/HOST/PATH,target=/CONTAINER/PATH,readonly nginx
```

:::note
Docker는 `-v` 대신 `--mount` 구문을 사용할 것을 권장합니다. 이는 마운팅 프로세스에 대한 더 나은 제어를 제공하고 누락된 디렉토리와 관련된 잠재적인 문제를 피할 수 있습니다.
:::

### Docker가 호스트 파일에 액세스할 수 있는 파일 권한 {#file-permissions-for-docker-access-to-host-files}

바인드 마운트를 사용할 때 Docker가 호스트 디렉토리에 액세스할 수 있는 권한을 갖는 것이 중요합니다. 읽기/쓰기 액세스를 부여하려면 컨테이너 생성 중 `-v` 또는 `--mount` 플래그와 함께 `:ro` 플래그(읽기 전용) 또는 `:rw` 플래그(읽기/쓰기)를 사용할 수 있습니다.
예를 들어, 다음 명령어는 읽기/쓰기 액세스 권한을 부여합니다.

```bash
$ docker run -v HOST-DIRECTORY:/CONTAINER-DIRECTORY:rw nginx
```

읽기 전용 바인드 마운트는 컨테이너가 호스트의 마운트된 파일을 읽을 수 있지만 변경하거나 삭제할 수 없습니다. 읽기/쓰기 바인드 마운트를 사용하면 컨테이너가 마운트된 파일을 수정하거나 삭제할 수 있으며 이러한 변경 사항이나 삭제는 호스트 시스템에도 반영됩니다. 읽기 전용 바인드 마운트는 컨테이너가 호스트의 파일을 실수로 수정하거나 삭제하지 않도록 보장합니다.

> **동기화된 파일 공유**
>
> 코드베이스가 커짐에 따라 바인드 마운트와 같은 전통적인 파일 공유 방법은 비효율적이거나 느려질 수 있습니다. 특히 개발 환경에서 파일에 자주 액세스해야 하는 경우 동기화된 파일 공유는 동기화된 파일 시스템 캐시를 활용하여 바인드 마운트 성능을 향상시킵니다. 이 최적화는 호스트와 가상 머신(VM) 간의 파일 액세스를 빠르고 효율적으로 보장합니다.

## 직접 해보기 {#try-it-out}

이 실습 가이드에서는 호스트와 컨테이너 간에 파일을 공유하기 위해 바인드 마운트를 생성하고 사용하는 방법을 연습합니다.

### 컨테이너 실행 {#run-a-container}

1. Docker Desktop을 [다운로드하고 설치](/get-started/get-docker/)합니다.

2. 다음 명령어를 사용하여 [httpd](https://hub.docker.com/_/httpd) 이미지를 사용하여 컨테이너를 시작합니다:

   ```bash
   $ docker run -d -p 8080:80 --name my_site httpd:2.4
   ```

   이는 백그라운드에서 `httpd` 서비스를 시작하고, 웹페이지를 호스트의 포트 `8080`에 게시합니다.

3. 브라우저를 열고 [http://localhost:8080](http://localhost:8080)에 액세스하거나 curl 명령어를 사용하여 작동 여부를 확인합니다.

   ```bash
   $ curl localhost:8080
   ```

### 바인드 마운트 사용 {#use-a-bind-mount}

바인드 마운트를 사용하여 호스트 컴퓨터의 구성 파일을 컨테이너 내의 특정 위치에 매핑할 수 있습니다. 이 예제에서는 바인드 마운트를 사용하여 웹페이지의 모양과 느낌을 변경하는 방법을 보여줍니다:

1. Docker Desktop 대시보드를 사용하여 기존 컨테이너를 삭제합니다:

   ![Docker Desktop 대시보드에서 httpd 컨테이너를 삭제하는 방법을 보여주는 스크린샷](images/delete-httpd-container.webp?border=true)

2. 호스트 시스템에 `public_html`이라는 새 디렉토리를 만듭니다.

   ```bash
   $ mkdir public_html
   ```

3. 디렉토리를 `public_html`로 변경하고 다음 내용을 포함하는 `index.html` 파일을 만듭니다. 이는 친근한 고래가 환영하는 간단한 웹페이지를 만드는 기본 HTML 문서입니다.

   ```html
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <title>My Website with a Whale & Docker!</title>
     </head>
     <body>
       <h1>Whalecome!!</h1>
       <p>Look! There's a friendly whale greeting you!</p>
       <pre id="docker-art">
            ##         .
         ## ## ##        ==
         ## ## ## ## ##    ===
         /"""""""""""""""""\___/ ===
         {                       /  ===-
         \______ O           __/
         \    \         __/
         \____\_______/
         
         Hello from Docker!
       </pre>
     </body>
   </html>
   ```

4. 이제 컨테이너를 실행할 시간입니다. `--mount` 및 `-v` 예제는 동일한 결과를 생성합니다. 첫 번째를 실행한 후 `my_site` 컨테이너를 제거하지 않으면 둘 다 실행할 수 없습니다.

   <Tabs>
   <TabItem value="v-option" label="-v">
      ```bash
      docker run -d --name my_site -p 8080:80 -v .:/usr/local/apache2/htdocs/ httpd:2.4
      ```
   </TabItem>

   <TabItem value="mount-option" label="--mount">
      ```bash
      docker run -d --name my_site -p 8080:80 --mount type=bind,source=./,target=/usr/local/apache2/htdocs/ httpd:2.4
      ```
   </TabItem>
   </Tabs>

   :::tip  
   Windows PowerShell에서 `-v` 또는 `--mount` 플래그를 사용할 때는 디렉토리의 절대 경로를 제공해야 합니다. 이는 PowerShell이 Mac 및 Linux 환경에서 일반적으로 사용되는 bash와 다르게 상대 경로를 처리하기 때문입니다.
   :::

   이제 모든 것이 실행 중이므로 [http://localhost:8080](http://localhost:8080)에서 사이트에 액세스하여 친근한 고래가 환영하는 새로운 웹페이지를 확인할 수 있습니다.

### Docker Desktop 대시보드에서 파일 액세스 {#access-the-file-on-the-docker-desktop-dashboard}

1. 컨테이너의 **Files** 탭을 선택하고 `/usr/local/apache2/htdocs/` 디렉토리 내의 파일을 선택하여 마운트된 파일을 볼 수 있습니다. 그런 다음 **Open file editor**를 선택합니다.

   ![컨테이너 내의 마운트된 파일을 보여주는 Docker Desktop 대시보드의 스크린샷](images/mounted-files.webp?border=true)

2. 호스트에서 파일을 삭제하고 컨테이너에서도 파일이 삭제되었는지 확인합니다. Docker Desktop 대시보드의 **Files**에서 더 이상 파일이 존재하지 않음을 알 수 있습니다.

   ![컨테이너 내의 삭제된 파일을 보여주는 Docker Desktop 대시보드의 스크린샷](images/deleted-files.webp?border=true)

3. 호스트 시스템에서 HTML 파일을 다시 생성하고 Docker Desktop 대시보드의 **Containers**의 **Files** 탭에서 파일이 다시 나타나는지 확인합니다. 이제 사이트에도 액세스할 수 있습니다.

### 컨테이너 중지 {#stop-your-container}

컨테이너는 중지할 때까지 계속 실행됩니다.

1. Docker Desktop 대시보드에서 **Containers** 보기로 이동합니다.

2. 중지하려는 컨테이너를 찾습니다.

3. 작업 열에서 **Delete** 작업을 선택합니다.

![컨테이너를 삭제하는 방법을 보여주는 Docker Desktop 대시보드의 스크린샷](images/delete-the-container.webp?border=true)

## 추가 자료 {#additional-resources}

다음 자료는 바인드 마운트에 대해 더 많이 배우는 데 도움이 됩니다:

- [Docker에서 데이터 관리](/storage/)
- [볼륨](/storage/volumes/)
- [바인드 마운트](/storage/bind-mounts/)
- [컨테이너 실행](/reference/run/)
- [스토리지 오류 문제 해결](/storage/troubleshooting_volume_errors/)
- [컨테이너 데이터 유지](/get-started/docker-concepts/running-containers/persisting-container-data/)

## 다음 단계 {#next-steps}

이제 컨테이너와 로컬 파일을 공유하는 방법을 배웠으므로 다중 컨테이너 애플리케이션에 대해 배울 차례입니다.

<Button href="Multi-container applications">다중 컨테이너 애플리케이션</Button>
