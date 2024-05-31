import mergeUint8Arrays from '@proton/utils/mergeUint8Arrays';

import { useDownload } from '../../store/_downloads';
import { useLink, validateLinkName } from '../../store/_links';
import useUploadHelper from '../../store/_uploads/UploadProvider/useUploadHelper';
import { useAbortSignal } from '../../store/_views/utils';
import { ValidationError } from '../../utils/errorHandling/ValidationError';
import { streamToBuffer } from '../../utils/stream';
import { LegacyNodeMeta } from '../interface';
import { DecryptedNode } from './interface';
import { decryptedLinkToNode } from './utils';

export const useNode = () => {
    const { getLink } = useLink();
    const { downloadStream } = useDownload();
    const { findAvailableName } = useUploadHelper();
    const abortSignal = useAbortSignal([]);

    const getNode = async ({ shareId, linkId, volumeId }: LegacyNodeMeta): Promise<DecryptedNode> => {
        const link = await getLink(abortSignal, shareId, linkId);

        return decryptedLinkToNode(link, volumeId);
    };

    const getNodeContents = async ({
        shareId,
        linkId,
        volumeId,
    }: LegacyNodeMeta): Promise<{
        contents: Uint8Array;
        node: DecryptedNode;
    }> => {
        const link = await getLink(abortSignal, shareId, linkId);

        const { stream, controls } = downloadStream([
            {
                ...link,
                shareId,
            },
        ]);
        const cancelListener = () => {
            controls.cancel();
        };
        abortSignal.addEventListener('abort', cancelListener);
        const buffer = await streamToBuffer(stream);
        abortSignal.removeEventListener('abort', cancelListener);

        return {
            contents: mergeUint8Arrays(buffer),
            node: decryptedLinkToNode(link, volumeId),
        };
    };

    const findAvailableNodeName = async ({ shareId, linkId: parentLinkId }: LegacyNodeMeta, filename: string) => {
        const error = validateLinkName(filename);

        if (error) {
            throw new ValidationError(error);
        }

        const name = await findAvailableName(abortSignal, { shareId, parentLinkId, filename });

        return name.filename;
    };

    return {
        getNode,
        getNodeContents,
        findAvailableNodeName,
    };
};

export default useNode;
