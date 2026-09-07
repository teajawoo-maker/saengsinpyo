import HomeContent from '@/components/HomeContent';

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
  return <HomeContent />;
}
