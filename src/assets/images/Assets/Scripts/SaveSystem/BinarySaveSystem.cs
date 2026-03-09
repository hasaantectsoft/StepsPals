using System;
using System.IO;
using System.Text;
using Data.Models;
using Newtonsoft.Json;
using UnityEngine;

namespace SaveSystem
{
    public class BinarySaveSystem : ISaveSystem
    {
        private static string SavePath => Application.persistentDataPath + "/game_save.dat";

        public void RetrieveGameState(Action<GameStateModel> onSuccess, Action onError = null)
        {
            using FileStream fileStream = new(SavePath, FileMode.OpenOrCreate);
            if (fileStream.Length == 0)
            {
                onSuccess?.Invoke(GameStateModel.CreateEmptyGameStateModel());
                return;
            }

            using BinaryReader reader = new(fileStream);
            string jsonString = reader.ReadString();

            GameStateModel gameStateModel;
            try
            {
                gameStateModel = JsonConvert.DeserializeObject<GameStateModel>(jsonString);
            }
            catch (Exception)
            {
                gameStateModel = GameStateModel.CreateEmptyGameStateModel();
            }

            onSuccess?.Invoke(ValidateSaveData(gameStateModel));
        }

        public void SaveGameState(GameStateModel gameStateModel)
        {
            using FileStream fileStream = File.Open(SavePath, FileMode.Create);
            using BinaryWriter writer = new(fileStream, Encoding.UTF8, false);
            string json = JsonConvert.SerializeObject(gameStateModel);
            writer.Write(json);
        }

        public void DeleteSaveFile()
        {
            if (File.Exists(SavePath))
            {
                File.Delete(SavePath);
                Debug.Log("Save file on device deleted.");
            }
            else
            {
                Debug.Log("No save file found to delete.");
            }
        }

        private static GameStateModel ValidateSaveData(GameStateModel gameStateModel)
        {
            return gameStateModel;
        }
    }
}