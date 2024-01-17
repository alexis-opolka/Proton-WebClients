import React, { useEffect, useState } from 'react';

import { BalanceOverview, ExploreProtonWalletSection, WalletSetupModal, YourWalletsSection } from '../components';
import { useOnchainWalletContext } from '../contexts';

export const MultiWalletDashboardContainer = () => {
    const { wallets } = useOnchainWalletContext();

    const [isSetupModalOpenned, setIsSetupModalOpenned] = useState(false);

    useEffect(() => {
        setIsSetupModalOpenned(!wallets?.length);
    }, [setIsSetupModalOpenned, wallets?.length]);

    return (
        <>
            <div className="flex flex-row w-full h-full flex-nowrap grow">
                <div className="flex-1 p-8">
                    <BalanceOverview wallets={wallets} />
                    <YourWalletsSection
                        onAddWallet={() => {
                            setIsSetupModalOpenned(true);
                        }}
                    />
                    <ExploreProtonWalletSection />
                </div>
            </div>

            <WalletSetupModal isOpen={isSetupModalOpenned} onClose={() => setIsSetupModalOpenned(false)} />
        </>
    );
};
