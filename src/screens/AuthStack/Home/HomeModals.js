import React from "react";
import PetDieModal from "../../../components/PetDieModal/PetDieModal";
import UpgradePetModal from "../../../components/UpgradePetModal/upgradepetmodal";
import { DeleteMessageModal } from "../../../components/Modal";

export default function HomeModals({
    showPetDieModal,
    setShowPetDieModal,
    upgradeModal,
    setUpgradeModal,
    petname,
    handleAdultContinue,
    handleAddToCollectionPress,
    adultFlowModal,
    setAdultFlowModal,
    oldestPet,
    handleAdultYes,
    styles,
}) {
    return (
        <>
            <PetDieModal isVisible={showPetDieModal} onClose={() => setShowPetDieModal(false)} />

            <UpgradePetModal
                isVisible={upgradeModal === "stage7"}
                showPet={true}
                btn={false}
                title={"Good job!"}
                subtitle={"Your pet has grown up!"}
                bottomtext={`You’ve taken care of \n${petname}\n for 7 days!`}
                okPressed={() => setUpgradeModal(null)}
            />
            <UpgradePetModal
                isVisible={upgradeModal === "stage21"}
                showPet={true}
                btn={false}
                title={"Congratulations!"}
                subtitle={`${petname} has fully grown!`}
                bottomtext={`Keep nurturing ${petname} to stay on track and maintain your streak!`}
                okPressed={handleAdultContinue}
            />
            <UpgradePetModal
                isVisible={upgradeModal === "add"}
                show_continue_button={false}
                showPet={true}
                btn={true}
                onClose={() => setUpgradeModal(null)}
                onAddToCollection={handleAddToCollectionPress}
            />

            <DeleteMessageModal
                isVisible={adultFlowModal === "space"}
                onClose={() => setAdultFlowModal(null)}
                subtitle={"Would you like to choose new pet?"}
                btn1text={"No"}
                btn2text={"Yes"}
                onpressButton2={handleAdultYes}
                modalStyle={styles.modalStyle}
                yellowBtn={true}
            />
            <DeleteMessageModal
                isVisible={adultFlowModal === "full"}
                onClose={() => setAdultFlowModal(null)}
                subtitle={`Do you want to replace\nyour oldest pet?\n${oldestPet?.name ?? ""}\nwith this new one?`}
                btn1text={"No"}
                btn2text={"Yes"}
                onpressButton2={handleAdultYes}
                modalStyle={styles.modalStyle}
                yellowBtn={true}
            />
        </>
    );
}

