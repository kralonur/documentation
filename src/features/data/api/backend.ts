import EleventyFetch from "@11ty/eleventy-fetch"
import { ChainMetadata } from "."
import { Chain } from "../chains"

export const getServerSideChainMetadata = async (chains: Chain[]): Promise<ChainMetadata> => {
  const cache = {} as ChainMetadata

  chains.forEach(async (chain) => {
    const requests = chain.networks.map((nw) =>
      nw?.rddUrl
        ? EleventyFetch(nw?.rddUrl, {
            duration: "1d", // save for 1 day
            type: "json", // we’ll parse JSON for you
          }).then((metadata) => ({
            ...nw,
            metadata: metadata.filter((meta) => meta.docs?.hidden !== true),
          }))
        : undefined
    )
    const networks = await Promise.all(requests)

    cache[chain.page] = { ...chain, networks }
  })

  return cache
}
