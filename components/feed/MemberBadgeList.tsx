import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import Badge from '@/components/common/Badge';
import { FeedConnectedUser } from '@/types/feed';
import { height, width } from '@/theme/globalStyles';

interface MemberBadgeListProps {
  members: FeedConnectedUser[];
  onRemove: (userId: number) => void;
}

export default function MemberBadgeList({
  members,
  onRemove,
}: MemberBadgeListProps) {
  return (
    <ScrollContainer
      horizontal
      showsHorizontalScrollIndicator={false}
      hasMembers={members.length > 0}
    >
      {members.map((member) => (
        <BadgeWrapper key={member.userId}>
          <Badge
            label={member.name}
            variant="primary"
            iconType="x"
            onRemove={() => onRemove(member.userId)}
          />
        </BadgeWrapper>
      ))}
    </ScrollContainer>
  );
}

const ScrollContainer = styled.ScrollView<{ hasMembers: boolean }>`
  margin-top: ${8 * height}px;
  ${({ hasMembers }) =>
    hasMembers
      ? `min-height: ${32 * height}px;`
      : 'height: 0px; padding-vertical: 0px;'}
`;

const BadgeWrapper = styled.View`
  margin-right: ${8 * width}px;
`;
