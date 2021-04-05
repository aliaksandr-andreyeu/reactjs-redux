import { orderOptions } from './constants';
import { ArrowColors } from './models';
import colors from '../../../../constants/colors';

export const getArrowColors = orderOption => {
  switch (orderOption) {
    case orderOptions.asc:
      return new ArrowColors(colors.brandColorBright, colors.disabledIcon);
    case orderOptions.desc:
      return new ArrowColors(colors.disabledIcon, colors.brandColorBright);
    default:
      return new ArrowColors(colors.basicLightText, colors.basicLightText);
  }
};
