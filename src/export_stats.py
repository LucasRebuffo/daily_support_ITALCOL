import os
import shutil


def copy_db_to_docs(db_path: str = 'excel_stats.db', output_path: str = os.path.join('docs', 'data', 'excel_stats.db')) -> None:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    if not os.path.exists(db_path):
        raise FileNotFoundError(f"No existe la base de datos: {db_path}")
    shutil.copy2(db_path, output_path)
    print(f"Copiado {db_path} -> {output_path}")


if __name__ == '__main__':
    copy_db_to_docs()
