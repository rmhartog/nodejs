/* @flow */
import flatten from 'lodash.flatten'
import type { SyncAction, ActionGroup } from '../../../types/sdk'
import createBuildActions from './utils/create-build-actions'
import createMapActionGroup from './utils/create-map-action-group'
import * as zonesActions from './zones-actions'
import * as diffpatcher from './utils/diffpatcher'

export const actionGroups = ['base', 'locations']

function createZonesMapActions(mapActionGroup) {
  return function doMapActions(diff, newObj, oldObj /* , options */) {
    const allActions = []

    allActions.push(
      mapActionGroup('base', () =>
        zonesActions.actionsMapBase(diff, oldObj, newObj)
      )
    )

    allActions.push(
      flatten(
        mapActionGroup('locations', () =>
          zonesActions.actionsMapLocations(diff, oldObj, newObj)
        )
      )
    )

    return flatten(allActions)
  }
}

export default (config: Array<ActionGroup>): SyncAction => {
  // config contains information about which action groups
  // are white/black listed

  // createMapActionGroup returns function 'mapActionGroup' that takes params:
  // - action group name
  // - callback function that should return a list of actions that correspond
  //    to the for the action group

  // this resulting function mapActionGroup will call the callback function
  // for whitelisted action groups and return the return value of the callback
  // It will return an empty array for blacklisted action groups
  const mapActionGroup = createMapActionGroup(config)
  const doMapActions = createZonesMapActions(mapActionGroup)
  const buildActions = createBuildActions(diffpatcher.diff, doMapActions)
  return { buildActions }
}
