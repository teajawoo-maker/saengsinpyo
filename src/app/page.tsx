import HomeContent from '@/components/HomeContent';
import JsonLd from '@/components/JsonLd';
import { webApplicationJsonLd } from '@/lib/jsonLd';
import { pageMetadata } from '@/lib/pageMeta';

export const metadata = pageMetadata({
  title: '우리집 생신표 | 음력 생일 양력 변환',
  description: '음력 생일을 양력으로 변환해 드려요. 부모님·조부모님 음력 생신을 올해·내년 날짜로 바로 확인하세요.',
  path: '/',
  image: 'home.png',
  imageAlt: '음력 생신, 올해는 양력 며칠? — 우리집 생신표',
  shareTitle: '음력 생일 계산기 | 우리집 생신표',
  shareDescription: '음력 생신을 넣으면 올해·내년 양력 날짜와 남은 날을 바로 알려드려요. 윤달·30일 처리, 띠·환갑까지.',
});

/**
 * 하루에 한 번 페이지를 다시 만든다.
 *
 * 계산기의 태어난 해 목록이 올해까지 이어져야 하는데, 한 번 만들고 두면
 * 해가 바뀌어도 지난해까지만 남는다. 그러면 그해 태어난 아이를 넣을 수
 * 없고, 서버가 보낸 화면과 브라우저가 계산한 값도 어긋난다.
 *
 * 재생성 주기를 두려면 페이지가 서버 컴포넌트여야 해서, 화면 내용은
 * HomeContent로 옮기고 여기서는 감싸기만 한다.
 */
export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      <JsonLd data={webApplicationJsonLd()} />
      <HomeContent />
    </>
  );
}
