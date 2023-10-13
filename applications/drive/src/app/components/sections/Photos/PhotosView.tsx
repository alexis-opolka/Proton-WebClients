import React, { FC, useCallback, useMemo, useRef, useState } from 'react';

import { c } from 'ttag';

import { NavigationControl, useAppTitle } from '@proton/components';
import { Loader } from '@proton/components/components';

import { PhotoLink, usePhotosView, useThumbnailsDownload } from '../../../store';
import PortalPreview from '../../PortalPreview';
import { useDetailsModal } from '../../modals/DetailsModal';
import { useLinkSharingModal } from '../../modals/ShareLinkModal/ShareLinkModal';
import UploadDragDrop from '../../uploads/UploadDragDrop/UploadDragDrop';
import ToolbarRow from '../ToolbarRow/ToolbarRow';
import { PhotosEmptyView } from './PhotosEmptyView';
import { PhotosGrid } from './PhotosGrid';
import { PhotosClearSelectionButton } from './components/PhotosClearSelectionButton';
import { usePhotosSelection } from './hooks';
import { PhotosToolbar } from './toolbar';

export const PhotosView: FC<void> = () => {
    useAppTitle(c('Title').t`Photos`);

    const { shareId, linkId, photos, isLoading, isLoadingMore, loadPhotoLink, photoLinkIdToIndexMap, photoLinkIds } =
        usePhotosView();
    const { selectedItems, clearSelection, isGroupSelected, isItemSelected, handleSelection } = usePhotosSelection(
        photos,
        photoLinkIdToIndexMap
    );

    const [detailsModal, showDetailsModal] = useDetailsModal();
    const [linkSharingModal, showLinkSharingModal] = useLinkSharingModal();
    const [previewLinkId, setPreviewLinkId] = useState<string | undefined>();

    const thumbnails = useThumbnailsDownload();

    const handleItemRender = (itemLinkId: string, domRef: React.MutableRefObject<unknown>) =>
        loadPhotoLink(itemLinkId, domRef);

    const handleItemRenderLoadedLink = (itemLinkId: string, domRef: React.MutableRefObject<unknown>) => {
        if (shareId) {
            thumbnails.addToDownloadQueue(shareId, itemLinkId, undefined, domRef);
        }
    };

    const photoCount = photoLinkIds.length;
    const selectedCount = selectedItems.length;

    const handleToolbarPreview = useCallback(() => {
        let selected = selectedItems[0];

        if (selectedItems.length === 1 && selected) {
            setPreviewLinkId(selected.linkId);
        }
    }, [selectedItems, setPreviewLinkId]);

    const previewRef = useRef<HTMLDivElement>(null);
    const previewIndex = useMemo(
        () => photoLinkIds.findIndex((item) => item === previewLinkId),
        [photoLinkIds, previewLinkId]
    );
    const previewItem = useMemo(
        () => (previewLinkId !== undefined ? (photos[photoLinkIdToIndexMap[previewLinkId]] as PhotoLink) : undefined),
        [photos, previewLinkId, photoLinkIdToIndexMap]
    );
    const setPreviewIndex = useCallback(
        (index: number) => setPreviewLinkId(photoLinkIds[index]),
        [setPreviewLinkId, photoLinkIds]
    );

    if (isLoading && !isLoadingMore) {
        return <Loader />;
    }

    if (!shareId || !linkId) {
        return <PhotosEmptyView />;
    }

    const isEmpty = photos.length === 0;

    return (
        <>
            {detailsModal}
            {linkSharingModal}
            {previewItem && (
                <PortalPreview
                    ref={previewRef}
                    shareId={shareId}
                    linkId={previewItem.linkId}
                    revisionId={previewItem.activeRevision.id}
                    key="portal-preview-photos"
                    open={!!previewItem}
                    date={previewItem.activeRevision.photo.captureTime}
                    onShare={
                        !!previewItem?.trashed
                            ? undefined
                            : () => showLinkSharingModal({ shareId, linkId: previewItem.linkId })
                    }
                    onDetails={() =>
                        showDetailsModal({
                            shareId,
                            linkId: previewItem.activeRevision.photo.linkId,
                        })
                    }
                    navigationControls={
                        <NavigationControl
                            current={previewIndex + 1}
                            total={photoCount}
                            rootRef={previewRef}
                            onPrev={() => setPreviewIndex(previewIndex - 1)}
                            onNext={() => setPreviewIndex(previewIndex + 1)}
                        />
                    }
                    onClose={() => setPreviewLinkId(undefined)}
                    onExit={() => setPreviewLinkId(undefined)}
                />
            )}

            <UploadDragDrop
                isForPhotos
                shareId={shareId}
                linkId={linkId}
                className="flex flex-column flex-nowrap flex-item-fluid"
            >
                <ToolbarRow
                    titleArea={
                        <span className="text-strong pl-1">
                            {selectedCount > 0 ? (
                                <div className="flex gap-2">
                                    <PhotosClearSelectionButton onClick={clearSelection} />
                                    {c('Info').jt`${selectedCount} selected`}
                                </div>
                            ) : (
                                c('Title').t`Photos`
                            )}
                        </span>
                    }
                    toolbar={
                        <PhotosToolbar
                            shareId={shareId}
                            linkId={linkId}
                            selectedItems={selectedItems}
                            onPreview={handleToolbarPreview}
                        />
                    }
                />

                {isEmpty ? (
                    <PhotosEmptyView />
                ) : (
                    <PhotosGrid
                        data={photos}
                        onItemRender={handleItemRender}
                        onItemRenderLoadedLink={handleItemRenderLoadedLink}
                        isLoadingMore={isLoadingMore}
                        onItemClick={setPreviewLinkId}
                        hasSelection={selectedCount > 0}
                        onSelectChange={handleSelection}
                        isGroupSelected={isGroupSelected}
                        isItemSelected={isItemSelected}
                    />
                )}
            </UploadDragDrop>
        </>
    );
};
