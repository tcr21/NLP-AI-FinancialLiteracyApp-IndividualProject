from sklearn import metrics
import numpy as np
# for plotting
import matplotlib.pyplot as plt
import seaborn as sns

def print_evaluation_metrics(similarity_matrix_training_data_dtf): 
    # Accuracy, Precision, Recall
    accuracy = metrics.accuracy_score(similarity_matrix_training_data_dtf["True"], similarity_matrix_training_data_dtf["Predicted"])
    print("Accuracy:",  round(accuracy,3)) # Note: tested
    print("Detail:")
    print(metrics.classification_report(similarity_matrix_training_data_dtf["True"], similarity_matrix_training_data_dtf["Predicted"]))

def plot_confusion_matrix(similarity_matrix_training_data_dtf):
    classes_array = []
    for j in range(1, 4):
        classes_array.append(similarity_matrix_training_data_dtf.columns[j])
    classes = np.array(classes_array)

    cm = metrics.confusion_matrix(similarity_matrix_training_data_dtf["True"], similarity_matrix_training_data_dtf["Predicted"])
    fig, ax = plt.subplots()
    sns.heatmap(cm, annot=True, fmt='d', ax=ax, cmap=plt.cm.Blues, 
                cbar=False)
    ax.set(xlabel="Predicted", ylabel="True", xticklabels=classes, 
        yticklabels=classes, title="Confusion matrix")
    plt.yticks(rotation=0)
    fig, ax = plt.subplots(nrows=1, ncols=2)

    plt.show()
