/**
 * 구조화 데이터를 <script>로 심는다.
 * 화면에는 아무것도 그리지 않고 검색엔진만 읽는다.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
