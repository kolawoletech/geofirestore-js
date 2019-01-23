import { GeoFirestoreTypes } from './GeoFirestoreTypes';
import { GeoCollectionReference } from './GeoCollectionReference';
import { GeoTransaction } from './GeoTransaction';
import { GeoWriteBatch } from './GeoWriteBatch';

/**
 * `GeoFirestore` represents a Firestore Database and is the entry point for all GeoFirestore operations.
 */
export class GeoFirestore {
  /**
   * @param _firestore Firestore represents a Firestore Database and is the entry point for all Firestore operations.
   */
  constructor(private _firestore: GeoFirestoreTypes.web.Firestore | GeoFirestoreTypes.cloud.Firestore) {
    if (Object.prototype.toString.call(_firestore) !== '[object Object]') {
      throw new Error('Firestore must be an instance of Firestore');
    }
  }

  /**
   * Creates a write batch, used for performing multiple writes as a single atomic operation.
   * 
   * @return A new `GeoWriteBatch` instance.
   */
  public batch(): GeoWriteBatch {
    return new GeoWriteBatch(this._firestore.batch());
  }

  /**
   * Gets a `GeoCollectionReference` instance that refers to the collection at the specified path.
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return A new `GeoCollectionReference` instance.
   */
  public collection(collectionPath: string): GeoCollectionReference {
    return new GeoCollectionReference(this._firestore.collection(collectionPath));
  }

  /**
   * Executes the given updateFunction and then attempts to commit the changes applied within the transaction. If any document read within
   * the transaction has changed, the updateFunction will be retried. If it fails to commit after 5 attempts, the transaction will fail.
   *
   * @param updateFunction The function to execute within the transaction context.
   * @return If the transaction completed successfully or was explicitly aborted (by the updateFunction returning a failed Promise), the
   * Promise returned by the updateFunction will be returned here. Else if the transaction failed, a rejected Promise with the
   * corresponding failure error will be returned.
   */
  public runTransaction(
    updateFunction: (transaction: GeoTransaction | GeoFirestoreTypes.cloud.Transaction | GeoFirestoreTypes.web.Transaction) => Promise<any>
  ): Promise<any> {
    return (this._firestore as GeoFirestoreTypes.web.Firestore).runTransaction(updateFunction);
  }
}
