import { DocumentNodeMeta, DriveCompat } from '@proton/drive-store'
import { Result, UseCaseInterface } from '@standardnotes/domain-core'

import { NodeMeta } from '@proton/drive-store'
import { DebugCreateInitialCommit } from './CreateInitialCommit'
import { GetDocumentMeta } from './GetDocumentMeta'
import { getErrorString } from '../Util/GetErrorString'

export class DuplicateDocument implements UseCaseInterface<DocumentNodeMeta> {
  constructor(
    private driveCompat: DriveCompat,
    private getDocumentMeta: GetDocumentMeta,
    private createCommit: DebugCreateInitialCommit,
  ) {}

  async execute(newName: string, lookup: NodeMeta, state: Uint8Array): Promise<Result<DocumentNodeMeta>> {
    try {
      const node = await this.driveCompat.getNode(lookup)
      const shellResult = await this.driveCompat.createDocumentNode(
        { volumeId: lookup.volumeId, linkId: node.parentNodeId },
        newName,
      )

      const documentMetaResult = await this.getDocumentMeta.execute({
        volumeId: shellResult.volumeId,
        linkId: shellResult.linkId,
      })

      if (documentMetaResult.isFailed()) {
        return Result.fail(documentMetaResult.getError())
      }

      const newDoc = documentMetaResult.getValue()

      const commitResult = await this.createCommit.execute(newDoc, state, shellResult.keys)

      if (commitResult.isFailed()) {
        return Result.fail(commitResult.getError())
      }

      return Result.ok(shellResult)
    } catch (error) {
      return Result.fail(getErrorString(error) ?? 'Failed to duplicate document')
    }
  }
}
