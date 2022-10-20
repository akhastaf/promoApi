import { createPaginationObject, IPaginationMeta, IPaginationOptions, IPaginationOptionsRoutingLabels, paginate as defaultPaginate, Pagination } from 'nestjs-typeorm-paginate'
import * as page from 'nestjs-typeorm-paginate/dist/create-pagination'
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'

const oldCreatePaginationObject = createPaginationObject

async function overrideCount(queryObj) {
  const count = await queryObj.getCount()

  function overrideCreatePaginationObject<T, CustomMetaType extends ObjectLiteral = IPaginationMeta>(params: {
    items: T[]
    totalItems?: number
    currentPage: number
    limit: number
    route?: string
    metaTransformer?: (meta: IPaginationMeta) => CustomMetaType
    routingLabels?: IPaginationOptionsRoutingLabels
  }): Pagination<T, CustomMetaType> {

    // after this override, remaining calculation will be resume as same as previous
    params.totalItems = count

    return oldCreatePaginationObject(params)
  }

  (page.createPaginationObject as any) = overrideCreatePaginationObject
}

function revertOverride() {
  (page.createPaginationObject as any) = oldCreatePaginationObject
}

async function paginate<T, CustomMetaType = IPaginationMeta>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions<CustomMetaType>,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T, CustomMetaType>> {
  if (repositoryOrQueryBuilder instanceof Repository) {
    return await defaultPaginate<T, CustomMetaType>(repositoryOrQueryBuilder, options, searchOptions)
  }

  await overrideCount(repositoryOrQueryBuilder)
  const result = await paginate<T, CustomMetaType>(repositoryOrQueryBuilder, { ...options, countQueries: false })
  revertOverride()

  return result
}

export { paginate }