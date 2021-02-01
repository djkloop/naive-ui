import {
  h,
  Transition,
  ref,
  inject,
  toRef,
  defineComponent,
  VNode,
  PropType,
  computed,
  watch,
  nextTick,
  withDirectives
} from 'vue'
import { clickoutside } from 'vdirs'
import { createTreeMate } from 'treemate'
import type {
  BaseOption as BaseSelectOption,
  GroupOption,
  IgnoredOption
} from '../../select/src/interface'
import { BaseSelectMenuRef, NBaseSelectMenu } from '../../_base'
import { createSelectOptions } from './utils'
import {
  CascaderInjection,
  TmNode,
  Value,
  Filter,
  BaseOption,
  SelectMenuInstance
} from './interface'
import { tmOptions } from '../../select/src/utils'

export default defineComponent({
  name: 'NCascaderSelectMenu',
  props: {
    value: {
      type: [String, Number, Array] as PropType<Value | null>,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    pattern: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    tmNodes: {
      type: Array as PropType<TmNode[]>,
      default: () => []
    },
    filter: {
      type: Function as PropType<Filter>,
      default: (pattern: string, _: BaseOption, path: BaseOption[]) =>
        path.some((option) => option.label && ~option.label.indexOf(pattern))
    }
  },
  setup (props) {
    const NCascader = inject<CascaderInjection>(
      'NCascader'
    ) as CascaderInjection
    const menuInstRef = ref<BaseSelectMenuRef | null>(null)
    const selectOptionsRef = computed(() => {
      return createSelectOptions(props.tmNodes, NCascader.leafOnly)
    })
    const filteredSelectOptionsRef = computed(() => {
      const { filter, pattern } = props
      return selectOptionsRef.value
        .filter((option) => {
          return filter(
            pattern,
            { label: option.label, value: option.value },
            option.path
          )
        })
        .map((option) => ({
          value: option.value,
          label: option.label
        }))
    })
    const selectTreeMateRef = computed(() => {
      return createTreeMate<BaseSelectOption, GroupOption, IgnoredOption>(
        filteredSelectOptionsRef.value,
        tmOptions
      )
    })
    watch(toRef(props, 'value'), () => {
      void nextTick(() => {
        NCascader.syncSelectMenuPosition()
      })
    })
    watch(filteredSelectOptionsRef, () => {
      void nextTick(() => {
        NCascader.syncSelectMenuPosition()
      })
    })
    function handleToggleOption (option: BaseOption): void {
      doCheck(option)
    }
    function doCheck (option: BaseOption): void {
      if (props.multiple) {
        const { mergedValue, doCheck, doUncheck } = NCascader
        if (Array.isArray(mergedValue)) {
          if (!mergedValue.includes(option.value)) {
            doCheck(option.value)
          } else {
            doUncheck(option.value)
          }
        } else if (mergedValue === null) {
          doCheck(option.value)
        }
      } else {
        const { doCheck, closeMenu } = NCascader
        doCheck(option.value)
        closeMenu()
      }
    }
    function prev (): void {
      menuInstRef.value?.prev()
    }
    function next (): void {
      menuInstRef.value?.next()
    }
    function enter (): boolean {
      if (menuInstRef) {
        const pendingOptionData = menuInstRef.value?.getPendingOption()
        if (pendingOptionData) {
          doCheck(pendingOptionData)
        }
        return true
      }
      return false
    }
    function handleClickOutside (e: MouseEvent): void {
      NCascader.handleSelectMenuClickOutside(e)
    }
    const exposedRef: SelectMenuInstance = {
      prev,
      next,
      enter
    }
    return {
      NCascader,
      menuInstRef,
      selectTreeMate: selectTreeMateRef,
      handleToggleOption,
      handleClickOutside,
      ...exposedRef
    }
  },
  render () {
    const { NCascader } = this
    return (
      <Transition
        name="n-fade-in-scale-up-transition"
        appear={NCascader.isMounted}
      >
        {this.show
          ? withDirectives(
            (
              <NBaseSelectMenu
                ref="menuInstRef"
                class="n-cascader-menu"
                autoPending
                unstableThemeOverrides={
                  NCascader.mergedTheme.overrides.BaseSelectMenu
                }
                unstableTheme={NCascader.mergedTheme.peers.BaseSelectMenu}
                treeMate={this.selectTreeMate}
                multiple={this.multiple}
                value={this.value}
                onMenuToggleOption={this.handleToggleOption}
              />
            ) as VNode,
            [[clickoutside, this.handleClickOutside]]
          )
          : null}
      </Transition>
    )
  }
})