import { c, cE, cM, cTB, cB, cNotM } from '../../../_utils/cssr'
import fadeInScaleUpTransition from '../../../styles/_transitions/fade-in-scale-up'

export default c([
  ({ props }) => {
    const {
      color,
      textColor,
      textColorActive,
      textDecorationColor,
      textDecorationColorActive,
      itemColorHover,
      dividerColor,
      boxShadow,
      itemDisabledOpacity,
      borderRadius,
      transformDebounceScale
    } = props.$local
    const {
      easeInOutCubicBezier
    } = props.$base
    return [cTB('time-picker', {
      raw: `
        position: relative;
        display: inline-block;
      `
    }, [
      cM('invalid', [
        cB('input', [
          cE('input', {
            raw: `
                text-decoration: line-through;
                text-decoration-color: ${textDecorationColor};
              `
          })
        ])
      ]),
      cM('transition-disabled', [
        cB('input', [
          c('input', {
            raw: `
                transition: none;
              `
          })
        ])
      ])
    ]),
    cB('time-picker-selector', {
      raw: `
        outline: none;
        font-size: 12px;
        border-radius: ${borderRadius};
        margin: 4px 0;
        min-width: 104px;
        overflow: hidden;
        transform: ${transformDebounceScale};
        background-color: ${color};
        box-shadow: ${boxShadow};
      `
    }, [
      fadeInScaleUpTransition(),
      cB('time-picker-selector-actions', {
        raw: `
          height: 38px;
          align-items: center;
          display: flex;
          justify-content: space-evenly;
        `
      }, [
        cE('confirm', [
          cM('disabled', {
            raw: `
              cursor: not-allowed;
              opacity: 0.5;
            `
          })
        ])
      ]),
      cB('time-picker-selector-time', {
        raw: `
          height: 224px;
          display: flex;
          position: relative;
          border-bottom: 1px solid ${dividerColor};
        `
      }),
      cB('time-picker-selector-time-row', {
        raw: `
          flex-grow: 1;
          min-width: 52px;
          height: 224px;
          flex-direction: column;
          transition: box-shadow .3s ${easeInOutCubicBezier};
        `
      }, [
        cM('transition-disabled', [
          cE('item', {
            raw: `
              transition: background-color .3s ${easeInOutCubicBezier}, opacity .3s ${easeInOutCubicBezier};
            `
          })
        ]),
        cE('item', {
          raw: `
            cursor: pointer;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 
              color .3s ${easeInOutCubicBezier},
              background-color .3s ${easeInOutCubicBezier},
              opacity .3s ${easeInOutCubicBezier},
              text-decoration-color .3s ${easeInOutCubicBezier};
            background: transparent;
            text-decoration-color: transparent;
            color: ${textColor};
          `
        }, [
          cNotM('disabled', [
            c('&:hover', {
              raw: `
                background-color:  ${itemColorHover};
              `
            })
          ]),
          cM('active', {
            raw: `
              background-color: ${itemColorHover};
              color: ${textColorActive};
            `
          }),
          cM('disabled', {
            raw: `
              opacity: ${itemDisabledOpacity};
              cursor: not-allowed;
            `
          })
        ]),
        cM('invalid', [
          cE('item', [
            cM('active', {
              raw: `
                text-decoration: line-through;
                text-decoration-color: ${textDecorationColorActive};
              `
            })
          ])
        ])
      ])
    ])
    ]
  }
])