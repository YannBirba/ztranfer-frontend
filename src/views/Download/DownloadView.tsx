import { useQuery } from "@apollo/client";
import { Download, FrownIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { InputGroup } from "../../components/InputGroup/InputGroup";
import { Loader } from "../../components/Loader/Loader";
import { ToolTip } from "../../components/ToolTip/ToolTip";
import { getTransferByLinkToken } from "../../graphql/transfer/getTransferByLinkToken";
import { useFiles } from "../../hooks/useFiles";
import { Transfer } from "../../types/Transfer";
import {
  formatDateTimeToFrenchFormat,
  formatDateToFrenchFormat,
} from "../../utils/date";
import { humanFileSize } from "../../utils/file";
import styles from "./DownloadView.module.scss";

export const DownloadView = () => {
  const [searchParams] = useSearchParams();
  const [selectedFiles, setSelectedFiles] = useState<
    { fileName: string; name: string; signature: string }[]
  >([]);

  const tokenParts = searchParams.getAll("token");
  const token = tokenParts.join(".");

  const {
    data,
    loading: isLoadingTransfer,
    error: errorTransfer,
  } = useQuery<{
    getTransferByLinkToken: Transfer;
  }>(getTransferByLinkToken, {
    variables: {
      token,
    },
  });
  const initualLoadingRef = useRef(true);

  const { download } = useFiles();

  const transfer = data?.getTransferByLinkToken;

  const files = transfer?.files ?? [];

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(
        files.map((file) => {
          return {
            fileName: file.fileName,
            name: file.name,
            signature: file.signature,
          };
        })
      );
    }
  };

  const handleOnSelectChange = (fileName: string) => {
    if (selectedFiles.find((fn) => fn.fileName === fileName)) {
      setSelectedFiles((prev) => prev.filter((fn) => fn.fileName !== fileName));
    } else {
      const file = files.find((fn) => fn.fileName === fileName);
      if (!file) return;
      setSelectedFiles((prev) => [
        ...prev,
        {
          fileName: file.fileName,
          name: file.name,
          signature: file.signature,
        },
      ]);
    }
  };

  if (isLoadingTransfer && initualLoadingRef.current) {
    initualLoadingRef.current = false;
    return (
      <div className={styles.downloadView}>
        <div className={styles.downloadView__loader}>
          <Loader />
        </div>
      </div>
    );
  }

  if (!transfer || transfer.isPrivate) {
    return (
      <div className={styles.downloadView}>
        <h1 className={styles.downloadView__title}>
          <FrownIcon size={50} /> Ce lien n'est pas valide.
        </h1>
      </div>
    );
  }

  if (errorTransfer) {
    return (
      <div className={styles.downloadView}>
        <p className={styles.downloadView__error}>
          Une erreur est survenue lors du chargement des fichiers.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.downloadView}>
      <div className={styles.downloadView__header}>
        <h1 className={styles.downloadView__title}>{transfer.name}</h1>
        <p className={styles.downloadView__description}>
          {transfer.description}
        </p>
        <p className={styles.downloadView__infos}>
          <ToolTip content={transfer.createdBy.email}>
            Partagé par {transfer.createdBy.name}
          </ToolTip>{" "}
          le {formatDateToFrenchFormat(transfer.createdAt)}
          {transfer.link?.endDate && (
            <span>
              {" "}
              - Disponible jusqu'au{" "}
              {formatDateTimeToFrenchFormat(transfer.link.endDate)}
            </span>
          )}
        </p>
      </div>

      <h2 className={styles.downloadView__filesTitle}>
        Télécharger les fichiers
      </h2>

      <div className={styles.downloadView__filesContainer}>
        {files.length > 0 && (
          <div className={styles.downloadView__checkboxContainer}>
            <InputGroup
              width="max-content"
              type="checkbox"
              name="selectAllFiles"
              label="Tout sélectionner"
              onChange={handleSelectAll}
              checked={
                selectedFiles.length === files.length && files.length > 0
              }
              placeholder=""
              inputMode="none"
            />
          </div>
        )}
        <ul className={styles.downloadView__files}>
          {files.length > 0 ? (
            files.map((file) => (
              <li key={file.id} className={styles.downloadView__file}>
                <div className={styles.downloadView__file__header}>
                  <InputGroup
                    width="max-content"
                    type="checkbox"
                    name={`transfer-file-${file.id}`}
                    label={file.name}
                    onChange={() => {
                      handleOnSelectChange(file.fileName);
                    }}
                    checked={
                      selectedFiles.find(
                        (fn) => fn.fileName === file.fileName
                      ) !== undefined
                    }
                    placeholder=""
                    inputMode="none"
                  />
                  <div className={styles.downloadView__file__actions}>
                    <p>{humanFileSize(file.size)}</p>
                    <Button
                      variant="muted"
                      icon={<Download width={15} height={15} />}
                      onClick={() =>
                        download(
                          {
                            fileName: file.fileName,
                            name: file.name,
                            signature: file.signature,
                          },
                          files
                        )
                      }
                    />
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className={styles.downloadView__noFiles}>
              Ce transfert ne contient aucun fichier.
            </p>
          )}
        </ul>
      </div>
      {selectedFiles.length > 1 && (
        <Button
          icon={<Download width={35} height={35} />}
          variant="muted"
          className={styles.downloadViewFiles__downloadAll}
          onClick={() => {
            download(selectedFiles, files);
            setSelectedFiles([]);
          }}
        />
      )}
    </div>
  );
};
