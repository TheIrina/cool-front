"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
    revalidate: 3600,
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
    revalidate: 3600,
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const REGION_MAP_TTL = 5 * 60 * 1000 // 5 minutes
let regionMap = new Map<string, HttpTypes.StoreRegion>()
let regionMapUpdated = 0

export const getRegion = async (countryCode: string) => {
  try {
    const now = Date.now()

    // Clear in-memory cache if it's older than TTL
    if (regionMap.size > 0 && now - regionMapUpdated > REGION_MAP_TTL) {
      regionMap = new Map<string, HttpTypes.StoreRegion>()
      regionMapUpdated = 0
    }

    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    regionMapUpdated = now

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("co")

    return region
  } catch (e: unknown) {
    return null
  }
}
