---
title: 애플리케이션 업데이트
weight: 30
linkTitle: "Part 2: Update the application"
keywords:
  - 시작하기
  - 설정
  - 오리엔테이션
  - 빠른 시작
  - 소개
  - 개념
  - 컨테이너
  - 도커 데스크탑
description: 애플리케이션 변경하기
aliases:
  - /get-started/03_updating_app/
  - /guides/workshop/03_updating_app/
---

## 애플리케이션 업데이트 {#update-the-application}

[part 1](./02_our_app.md)에서, 당신은 todo 애플리케이션을 컨테이너화했습니다. 이 부분에서는 애플리케이션과 이미지를 업데이트할 것입니다. 또한 컨테이너를 중지하고 제거하는 방법도 배울 것입니다.

## 소스 코드 업데이트 {#update-the-source-code}

다음 단계에서는 todo 리스트 항목이 없을 때 "empty text"를 "You have no todo items yet! Add one above!"로 변경할 것입니다.

1. `src/static/js/app.js` 파일에서 56번째 줄을 새로운 빈 텍스트로 업데이트합니다.

   ```diff
   - <p className="text-center">No items yet! Add one above!</p>
   + <p className="text-center">You have no todo items yet! Add one above!</p>
   ```

2. `docker build` 명령어를 사용하여 업데이트된 버전의 이미지를 빌드합니다.

   ```bash
   $ docker build -t getting-started .
   ```

3. 업데이트된 코드를 사용하여 새 컨테이너를 시작합니다.

   ```bash
   $ docker run -dp 127.0.0.1:3000:3000 getting-started
   ```

아마도 다음과 같은 오류를 보았을 것입니다:

```bash
docker: Error response from daemon: driver failed programming external connectivity on endpoint laughing_burnell
(bb242b2ca4d67eba76e79474fb36bb5125708ebdabd7f45c8eaf16caaabde9dd): Bind for 127.0.0.1:3000 failed: port is already allocated.
```

이 오류는 이전 컨테이너가 여전히 실행 중일 때 새 컨테이너를 시작할 수 없기 때문에 발생했습니다. 그 이유는 이전 컨테이너가 이미 호스트의 3000번 포트를 사용하고 있는데, 한 시스템에서는 하나의 프로세스만 특정 포트를 사용할 수 있기 있기 때문입니다. 이를 해결하려면 이전 컨테이너를 제거해야 합니다.

## 이전 컨테이너 제거 {#remove-the-old-container}

컨테이너를 제거하려면 먼저 중지해야 합니다. 중지된 후에는 제거할 수 있습니다. CLI 또는 Docker Desktop의 그래픽 인터페이스를 사용하여 이전 컨테이너를 제거할 수 있습니다. 가장 편한 옵션을 선택하세요.

<Tabs>
  <TabItem value="cli" label="CLI">
    ### CLI를 사용하여 컨테이너 제거

    1. `docker ps` 명령어를 사용하여 컨테이너의 ID를 확인합니다.

       ```bash
       docker ps
       ```

    2. `docker stop` 명령어를 사용하여 컨테이너를 중지합니다. `<the-container-id>`를 `docker ps`에서 얻은 ID로 대체합니다.

       ```bash
       docker stop <the-container-id>
       ```

    3. 컨테이너가 중지되면 `docker rm` 명령어를 사용하여 제거할 수 있습니다.

       ```bash
       docker rm <the-container-id>
       ```

    > **참고**:
    > `docker rm` 명령어에 `force` 플래그를 추가하여 단일 명령어로 컨테이너를 중지하고 제거할 수 있습니다. 예를 들어:
    > ```bash
    > docker rm -f <the-container-id>
    > ```

  </TabItem>

  <TabItem value="docker-desktop" label="Docker Desktop">
    ### Docker Desktop을 사용하여 컨테이너 제거

    1. Docker Desktop의 **Containers** 뷰를 엽니다.
    2. 삭제하려는 컨테이너의 **Actions** 열 아래에 있는 휴지통 아이콘을 선택합니다.
    3. 확인 대화 상자에서 **Delete forever**를 선택합니다.

  </TabItem>
</Tabs>

### 업데이트된 앱 컨테이너 시작 {#start-the-updated-app-container}

1. 이제 `docker run` 명령어를 사용하여 업데이트된 앱을 시작합니다.

   ```bash
   $ docker run -dp 127.0.0.1:3000:3000 getting-started
   ```

2. 브라우저를 [http://localhost:3000](http://localhost:3000)에서 새로 고침하면 업데이트된 도움말 텍스트를 볼 수 있습니다.

## 요약 {#summary}

이 섹션에서는 컨테이너를 업데이트하고 다시 빌드하는 방법, 컨테이너를 중지하고 제거하는 방법을 배웠습니다.

관련 정보:

- [docker CLI reference](/reference/cli/docker/)

## 다음 단계 {#next-steps}

다음으로, 이미지를 다른 사람과 공유하는 방법을 배울 것입니다.

<Button href="sharing_app">애플리케이션 공유</Button>
