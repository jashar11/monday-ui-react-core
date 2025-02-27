import React, { ReactElement, useCallback, useRef } from "react";
import cx from "classnames";
import Avatar, { AvatarProps } from "../Avatar/Avatar";
import Counter from "../Counter/Counter";
import MenuButton from "../MenuButton/MenuButton";
import Menu from "../Menu/Menu/Menu";
import AvatarMenuItem from "../Menu/MenuItem/AvatarMenuItem";
import AvatarGroupCounterTooltipContainer from "./AvatarGroupCounterTooltipContainer";
import VibeComponentProps from "../../types/VibeComponentProps";
import { AvatarSize, AvatarType } from "../Avatar/AvatarConstants";
import { getStyle } from "../../helpers/typesciptCssModulesHelper";
import { AvatarGroupCounterVisualProps } from "./AvatarGroup";
import { TooltipProps } from "../Tooltip/Tooltip";
import { avatarOnClick } from "./AvatarGroupHelper";
import styles from "./AvatarGroupCounter.module.scss";
import { AVATAR_GROUP_COUNTER_AVATAR_SIZE } from "./AvatarGroupConstants";

export interface AvatarGroupCounterProps extends VibeComponentProps {
  /**
   * Array of Avatar elements
   */
  counterTooltipAvatars?: ReactElement<AvatarProps>[];
  /**
   * AvatarGroupCounterVisualProps: props for counter
   */
  counterProps?: AvatarGroupCounterVisualProps;
  counterTooltipCustomProps?: TooltipProps;
  counterTooltipIsVirtualizedList?: boolean;
  size?: AvatarSize;
  type?: AvatarType;
  counterAriaLabel?: string;
}

const AvatarGroupCounter: React.FC<AvatarGroupCounterProps> = ({
  counterTooltipAvatars = [],
  counterProps,
  counterTooltipCustomProps,
  counterTooltipIsVirtualizedList = false,
  size = Avatar.sizes.MEDIUM,
  type,
  counterAriaLabel
}) => {
  const {
    color: counterColor = Counter.colors.LIGHT,
    count: counterValue = counterTooltipAvatars.length,
    prefix: counterPrefix = "+",
    maxDigits: counterMaxDigits = 3,
    ariaLabelItemsName: counterAriaLabelItemsName = "items"
  } = counterProps || {};

  const counterSizeStyle = getStyle(styles, size?.toString());
  const counterColorStyle = styles[counterColor];

  const focusPrevPlaceholderRef = useRef(null);
  const focusNextPlaceholderRef = useRef(null);
  const counterContainerRef = useRef(null);
  const counterComponent = useCallback(() => {
    return (
      <Counter
        color={counterColor}
        count={counterValue}
        prefix={counterPrefix}
        maxDigits={counterMaxDigits}
        ariaLabel={counterAriaLabel ? counterAriaLabel : `Tab for more ${counterAriaLabelItemsName}`}
      />
    );
  }, [counterAriaLabel, counterAriaLabelItemsName, counterColor, counterMaxDigits, counterPrefix, counterValue]);

  if (!counterTooltipAvatars.length && !counterValue) {
    return null;
  }

  const areAvatarsClickable = counterTooltipAvatars.some(a => a.props?.onClick);
  if (areAvatarsClickable) {
    return (
      <MenuButton
        component={counterComponent}
        zIndex={1}
        className={cx(styles.counterContainer, counterSizeStyle, counterColorStyle)}
        ariaLabel={counterAriaLabel ? counterAriaLabel : `${counterValue} additional ${counterAriaLabelItemsName}`}
      >
        <Menu id="menu" size={Menu.sizes.MEDIUM} className={styles.menu} focusItemIndexOnMount={0}>
          {counterTooltipAvatars.map((avatar, index) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <AvatarMenuItem
                menuItemProps={{
                  key: avatar.props?.id || String(index),
                  title: (avatar.props?.tooltipProps?.content as string) || avatar?.props?.ariaLabel,
                  onClick: (event: React.MouseEvent | React.KeyboardEvent) => avatarOnClick(event, avatar.props)
                }}
                avatarProps={{
                  ...avatar.props,
                  customSize: AVATAR_GROUP_COUNTER_AVATAR_SIZE,
                  ariaLabel: "",
                  tabIndex: -1
                }}
              />
            );
          })}
        </Menu>
      </MenuButton>
    );
  }

  return (
    <AvatarGroupCounterTooltipContainer
      focusPrevPlaceholderRef={focusPrevPlaceholderRef}
      focusNextPlaceholderRef={focusNextPlaceholderRef}
      counterContainerRef={counterContainerRef}
      avatars={counterTooltipAvatars}
      counterTooltipCustomProps={counterTooltipCustomProps}
      counterTooltipIsVirtualizedList={counterTooltipIsVirtualizedList}
      type={type}
    >
      <div tabIndex={-1} ref={focusPrevPlaceholderRef} />
      {/* eslint-disable jsx-a11y/no-noninteractive-tabindex */}
      <div
        tabIndex={0}
        className={cx(styles.counterContainer, counterSizeStyle, counterColorStyle)}
        ref={counterContainerRef}
      >
        {/* eslint-enable jsx-a11y/no-noninteractive-tabindex */}
        {counterComponent()}
        <div tabIndex={-1} ref={focusNextPlaceholderRef} />
      </div>
    </AvatarGroupCounterTooltipContainer>
  );
};

export default AvatarGroupCounter;
