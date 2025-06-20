import { View } from 'react-native';
import { Badge } from '@/components';

/**
 * 1. label: 뱃지에 들어갈 텍스트
 * 2. variant: 색상 설정 ( primary : 메인컬러(보라색) , gray : 피드에서 쓰일 '함께하는 친구 추가' 뱃지)
 *                       white : 하트 갯수 표시할 때 )
 * 3. iconType: 뱃지 앞뒤에 아이콘이 있는 경우. ( 'plus' : 텍스트 앞에 플러스 아이콘 표시
 *                                       or 'x' : 텍스트 뒤에 X 아이콘 표시  )
 *                                    -> 'x'의 경우 반드시 onRemove 속성을 함께 전달해야 함.
 * 4. onRemove: iconType이 'x'인 경우에만 사용
 */
export default function BadgeExamples() {
  return (
    <View>
      {/* label 만 사용할 경우 */}
      <Badge label={'3기'} />

      {/* < + 이강혁 > 과 같이 보여주고 싶을 떄 */}
      <Badge
        variant="gray"
        label={'이강혁'}
        iconType="plus"
        onRemove={() => console.log()}
      />

      {/* 하얀색 배경 + 숫자로 사용할 경우 */}
      <Badge variant="white" label={'1,230'} />

      {/* < 이강혁 X > 와 같이 보여주고 싶을 때 */}
      <Badge
        variant="primary"
        iconType="x"
        onRemove={() => console.log()}
        label={'이강혁'}
      />
    </View>
  );
}
